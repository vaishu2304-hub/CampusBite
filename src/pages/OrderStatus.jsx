import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrder } from "../services/api";

function OrderStatus() {

  const navigate = useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [progress, setProgress] =
    useState(0);


  // ========================================
  // LOAD ORDER
  // ========================================

  useEffect(() => {

    let refreshTimer;

    async function loadOrder() {

      try {

        const saved =
          localStorage.getItem(
            "campusbite-last-order"
          );


        if (!saved) {
          throw new Error(
            "No recent order found."
          );
        }


        const savedOrder =
          JSON.parse(saved);


        if (!savedOrder.id) {
          throw new Error(
            "Invalid order."
          );
        }


        const latest =
          await getOrder(
            savedOrder.id
          );


        setOrder(latest);


        if (
          latest.status !==
          "Completed"
        ) {

          refreshTimer =
            setTimeout(
              loadOrder,
              2000
            );

        }

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to load your order."
        );

      } finally {

        setLoading(false);

      }
    }


    loadOrder();


    return () => {

      if (refreshTimer) {
        clearTimeout(
          refreshTimer
        );
      }

    };

  }, []);


  // ========================================
  // CALCULATE SMOOTH PROGRESS
  // ========================================

  useEffect(() => {

    if (!order) {
      return;
    }


    if (
      order.status ===
      "Completed"
    ) {

      setProgress(100);

      return;

    }


    const estimatedMinutes =
      Number(
        order.estimatedPickupMinutes
      ) || 5;


    const totalTime =
      estimatedMinutes *
      60 *
      1000;


    const startTime =
      new Date(
        order.createdAt
      ).getTime();


    function updateProgress() {

      const elapsed =
        Date.now() -
        startTime;


      let percentage =
        (elapsed /
          totalTime) *
        100;


      percentage =
        Math.max(
          0,
          Math.min(
            100,
            percentage
          )
        );


      setProgress(
        percentage
      );

    }


    updateProgress();


    const timer =
      setInterval(
        updateProgress,
        100
      );


    return () =>
      clearInterval(timer);

  }, [order]);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <main className="order-status-page">

        <div className="order-status-card">

          <h2>
            Loading your order...
          </h2>

        </div>

      </main>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (
    error ||
    !order
  ) {

    return (
      <main className="order-status-page">

        <div className="order-status-card">

          <h2>
            Unable to load order
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="continue-shopping"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to Menu
          </button>

        </div>

      </main>
    );
  }


  // ========================================
  // STEPS
  // ========================================

  const steps = [
    "Order Placed",
    "Preparing",
    "Ready for Pickup",
    "Completed"
  ];


  // ========================================
  // CURRENT STATUS
  // ========================================

  const currentIndex =
    steps.indexOf(
      order.status
    );


  // ========================================
  // RENDER
  // ========================================

  return (

    <main className="order-status-page">

      <div className="order-status-card">

        <span className="page-label">
          ORDER TRACKING
        </span>


        <h1>
          Order #{order.token}
        </h1>


        <p>
          We'll keep your order status updated.
        </p>


        {/* ================================= */}
        {/* TIMELINE */}
        {/* ================================= */}

        <div className="status-timeline">


          {/* BASE LINE */}

          <div className="timeline-line">

            {/* SMOOTH FILL */}

            <div
              className="timeline-line-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>


          {/* ================================= */}
          {/* STEPS */}
          {/* ================================= */}

          {steps.map(
            (step, index) => {

              const stepProgress =
                (index /
                  (steps.length - 1)) *
                100;


              const isActive =
                progress >=
                stepProgress;


              return (

                <div
                  key={step}
                  className={`status-step ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                >

                  <div
                    className="status-circle"
                  >

                    {isActive
                      ? "✓"
                      : index + 1}

                  </div>


                  <span>
                    {step}
                  </span>

                </div>

              );

            }
          )}

        </div>


        {/* ================================= */}
        {/* QUEUE + PICKUP */}
        {/* ================================= */}

        <div className="pickup-card">

          <div>

            <span>
              Queue Position
            </span>

            <strong>
              #{order.queuePosition}
            </strong>

          </div>


          <div>

            <span>
              Estimated Pickup
            </span>

            <strong>
              {order.estimatedPickupMinutes} min
            </strong>

          </div>

        </div>


        {/* ================================= */}
        {/* ITEMS */}
        {/* ================================= */}

        <h2>
          Items
        </h2>


        {order.items &&
          order.items.map(
            item => (

              <div
                className="checkout-item"
                key={item.id}
              >

                <span>
                  {item.name} ×{" "}
                  {item.quantity}
                </span>

                <strong>
                  ₹
                  {Number(item.price) *
                    Number(item.quantity)}
                </strong>

              </div>

            )
          )}


        <div className="summary-divider" />


        {/* ================================= */}
        {/* TOTAL */}
        {/* ================================= */}

        <div className="summary-total">

          <span>
            Total
          </span>

          <strong>
            ₹
            {Number(
              order.total
            ).toFixed(0)}
          </strong>

        </div>


        {/* ================================= */}
        {/* BACK */}
        {/* ================================= */}

        <button
          type="button"
          className="continue-shopping"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Menu
        </button>

      </div>

    </main>
  );
}

export default OrderStatus;