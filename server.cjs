const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const DB_FILE = path.join(__dirname, "db.json");

// ==========================================
// DATABASE
// ==========================================

function readDB() {
  const data = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(data);
}

function saveDB(db) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(db, null, 2)
  );
}

// ==========================================
// CORS
// ==========================================

function setCors(res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
}

// ==========================================
// RESPONSE
// ==========================================

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify(data));
}

// ==========================================
// REQUEST BODY
// ==========================================

function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", chunk => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        resolve(
          data ? JSON.parse(data) : {}
        );
      } catch {
        reject(
          new Error("Invalid request data.")
        );
      }
    });

    req.on("error", reject);
  });
}

// ==========================================
// PICKUP TIME
// FOOD BASED ONLY
// ==========================================

function calculatePickupTime(items) {

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return 5;
  }

  const prepTimes = items.map(item => {
    const time =
      Number(item.prepTime);

    return Number.isFinite(time)
      ? time
      : 5;
  });

  const longest =
    Math.max(...prepTimes);

  // Random 0-3 minutes

  const random =
    Math.floor(
      Math.random() * 4
    );

  return longest + random;
}

// ==========================================
// UPDATE STATUS BASED ON ESTIMATED TIME
// ==========================================

function updateOrderStatus(order) {

  if (!order.createdAt) {
    return order;
  }

  if (
    order.status === "Completed"
  ) {
    return order;
  }

  const estimatedMinutes =
    Number(
      order.estimatedPickupMinutes
    ) || 5;

  const estimatedMilliseconds =
    estimatedMinutes *
    60 *
    1000;

  const createdTime =
    new Date(
      order.createdAt
    ).getTime();

  const elapsed =
    Date.now() -
    createdTime;

  // Percentage of estimated time completed

  const progress =
    elapsed /
    estimatedMilliseconds;


  // ----------------------------------------
  // STATUS TIMING
  // ----------------------------------------

  if (progress >= 1) {

    order.status =
      "Completed";

  } else if (progress >= 0.60) {

    order.status =
      "Ready for Pickup";

  } else if (progress >= 0.25) {

    order.status =
      "Preparing";

  } else {

    order.status =
      "Order Placed";

  }

  return order;
}

// ==========================================
// CREATE ORDER
// ==========================================

function createOrder(data) {

  const db = readDB();

  if (!Array.isArray(db.orders)) {
    db.orders = [];
  }

  if (!Array.isArray(db.foods)) {
    db.foods = [];
  }


  // ========================================
  // VALIDATION
  // ========================================

  if (
    !data.name ||
    !String(data.name).trim()
  ) {
    throw new Error(
      "Student name is required."
    );
  }

  if (
    !data.studentId ||
    !String(data.studentId).trim()
  ) {
    throw new Error(
      "Student ID is required."
    );
  }

  if (
    !Array.isArray(data.items) ||
    data.items.length === 0
  ) {
    throw new Error(
      "Your cart is empty."
    );
  }


  // ========================================
  // UPDATE OLD ORDERS
  // ========================================

  db.orders =
    db.orders.map(
      updateOrderStatus
    );


  // ========================================
  // CREATE ORDER ITEMS
  // ========================================

  const items = [];

  for (
    const cartItem of data.items
  ) {

    const food =
      db.foods.find(
        item =>
          String(item.id) ===
          String(cartItem.id)
      );


    if (!food) {
      throw new Error(
        "Food item not found."
      );
    }


    if (
      food.available !== true
    ) {
      throw new Error(
        `${food.name} is unavailable.`
      );
    }


    const quantity =
      Number(
        cartItem.quantity
      );


    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        `Invalid quantity for ${food.name}.`
      );
    }


    const stock =
      Number(food.stock);


    if (
      stock < quantity
    ) {
      throw new Error(
        `Only ${stock} ${food.name} available.`
      );
    }


    items.push({

      id: food.id,

      name: food.name,

      price:
        Number(food.price),

      quantity:
        quantity,

      prepTime:
        Number(food.prepTime) || 5,

      image:
        food.image || ""

    });
  }


  // ========================================
  // TOTAL
  // ========================================

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  // ========================================
  // QUEUE
  // ========================================

  const activeOrders =
    db.orders.filter(
      order =>
        order.status !==
        "Completed"
    );


  const queuePosition =
    activeOrders.length + 1;


  // ========================================
  // PICKUP TIME
  // ========================================
  //
  // IMPORTANT:
  // Queue position is NOT used.
  //
  // ========================================

  const estimatedPickupMinutes =
    calculatePickupTime(items);


  // ========================================
  // TOKEN
  // ========================================

  const token =
    "CB" +
    Math.floor(
      1000 +
      Math.random() * 9000
    );


  // ========================================
  // ORDER
  // ========================================

  const order = {

    id:
      Date.now().toString(),

    token:

      token,

    name:
      String(data.name).trim(),

    studentId:
      String(data.studentId).trim(),

    items:
      items,

    total:
      total,

    queuePosition:
      queuePosition,

    estimatedPickupMinutes:
      estimatedPickupMinutes,

    status:
      "Order Placed",

    createdAt:
      new Date().toISOString()
  };


  // ========================================
  // UPDATE STOCK
  // ========================================

  for (
    const item of items
  ) {

    const food =
      db.foods.find(
        food =>
          String(food.id) ===
          String(item.id)
      );


    food.stock =
      Number(food.stock) -
      item.quantity;


    if (
      food.stock <= 0
    ) {

      food.stock = 0;

      food.available =
        false;

    }
  }


  // ========================================
  // SAVE
  // ========================================

  db.orders.push(order);

  saveDB(db);


  console.log("");
  console.log(
    "=============================="
  );

  console.log(
    "NEW ORDER"
  );

  console.log(
    "Token:",
    order.token
  );

  console.log(
    "Queue:",
    "#" +
    order.queuePosition
  );

  console.log(
    "Pickup:",
    order.estimatedPickupMinutes +
    " min"
  );

  console.log(
    "Status:",
    order.status
  );

  console.log(
    "=============================="
  );

  console.log("");


  return order;
}

// ==========================================
// SERVER
// ==========================================

const server =
  http.createServer(
    async (req, res) => {

      setCors(res);


      // ====================================
      // OPTIONS
      // ====================================

      if (
        req.method ===
        "OPTIONS"
      ) {

        res.writeHead(204);

        res.end();

        return;
      }


      const url =
        new URL(
          req.url,
          `http://localhost:${PORT}`
        );


      // ====================================
      // GET FOODS
      // ====================================

      if (
        req.method === "GET" &&
        url.pathname === "/foods"
      ) {

        try {

          const db =
            readDB();

          sendJSON(
            res,
            200,
            db.foods
          );

        } catch {

          sendJSON(
            res,
            500,
            {
              message:
                "Unable to load foods."
            }
          );

        }

        return;
      }


      // ====================================
      // GET ALL ORDERS
      // ====================================

      if (
        req.method === "GET" &&
        url.pathname === "/orders"
      ) {

        try {

          const db =
            readDB();


          db.orders =
            (db.orders || [])
              .map(
                updateOrderStatus
              );


          saveDB(db);


          sendJSON(
            res,
            200,
            db.orders
          );

        } catch {

          sendJSON(
            res,
            500,
            {
              message:
                "Unable to load orders."
            }
          );

        }

        return;
      }


      // ====================================
      // GET ONE ORDER
      // ====================================

      if (
        req.method === "GET" &&
        url.pathname.startsWith(
          "/orders/"
        )
      ) {

        try {

          const id =
            url.pathname.split(
              "/"
            )[2];


          const db =
            readDB();


          const order =
            db.orders.find(
              item =>
                String(item.id) ===
                String(id)
            );


          if (!order) {

            sendJSON(
              res,
              404,
              {
                message:
                  "Order not found."
              }
            );

            return;
          }


          // Only status changes.
          // Pickup estimate NEVER changes.

          updateOrderStatus(
            order
          );


          saveDB(db);


          sendJSON(
            res,
            200,
            order
          );

        } catch {

          sendJSON(
            res,
            500,
            {
              message:
                "Unable to load order."
            }
          );

        }

        return;
      }


      // ====================================
      // POST ORDER
      // ====================================

      if (
        req.method === "POST" &&
        url.pathname === "/orders"
      ) {

        try {

          const data =
            await getBody(req);


          const order =
            createOrder(data);


          sendJSON(
            res,
            201,
            order
          );

        } catch (error) {

          console.error(
            "ORDER ERROR:",
            error.message
          );


          sendJSON(
            res,
            400,
            {
              message:
                error.message
            }
          );
        }

        return;
      }


      // ====================================
      // 404
      // ====================================

      sendJSON(
        res,
        404,
        {
          message:
            "Route not found."
        }
      );

    }
  );


// ==========================================
// START SERVER
// ==========================================

server.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "================================"
    );
    console.log(
      "       CAMPUSBITE SERVER"
    );
    console.log(
      "================================"
    );
    console.log(
      "API: http://localhost:3001"
    );
    console.log(
      "Server is running..."
    );
    console.log(
      "================================"
    );
    console.log("");

  }
);