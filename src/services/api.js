const API_URL = "http://localhost:3001";

export async function getFoods() {
  const response = await fetch(
    `${API_URL}/foods`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load food items."
    );
  }

  return response.json();
}


export async function createOrder(orderData) {

  console.log(
    "Sending order to server:",
    orderData
  );

  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(orderData)
    }
  );

  const data =
    await response.json();

  console.log(
    "Server response:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Unable to place order."
    );
  }

  return data;
}


export async function getOrder(id) {

  const response = await fetch(
    `${API_URL}/orders/${id}`
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Unable to load order."
    );
  }

  return data;
}


export async function getOrders() {

  const response = await fetch(
    `${API_URL}/orders`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load orders."
    );
  }

  return response.json();
}