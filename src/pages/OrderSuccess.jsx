import { useNavigate } from "react-router-dom";

function OrderSuccess() {

  const navigate =
    useNavigate();


  const savedOrder =
    localStorage.getItem(
      "campusbite-last-order"
    );


  const order =
    savedOrder
      ? JSON.parse(savedOrder)
      : null;


  // ========================================
  // NO ORDER
  // ========================================

  if (!order) {

    return (
      <main className="empty-state">

        <h2>
          No recent order found
        </h2>


        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
        >
          Back to Menu
        </button>

      </main>
    );
  }


  return (

    <main className="order-success-page">

      <div className="success-card">


        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✓
        </div>


        <span className="page-label">
          ORDER CONFIRMED
        </span>


        <h1>
          Order Placed Successfully!
        </h1>


        <p>
          Your order has been received by the
          campus canteen.
        </p>


        {/* TOKEN */}

        <div className="token-box">

          <span>
            Your Token
          </span>


          <strong>
            #{order.token}
          </strong>

        </div>


        {/* ORDER INFORMATION */}

        <div className="order-info-grid">


          <div>

            <span>
              Status
            </span>

            <strong>
              {order.status}
            </strong>

          </div>


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
              Pickup Estimate
            </span>

            <strong>
              {order.estimatedPickupMinutes} min
            </strong>

          </div>


          <div>

            <span>
              Total
            </span>

            <strong>
              ₹{Number(order.total).toFixed(0)}
            </strong>

          </div>

        </div>


        {/* TRACK ORDER */}

        <button
          type="button"
          className="track-order-button"
          onClick={() =>
            navigate("/order")
          }
        >
          Track Order
        </button>


        {/* BACK TO MENU */}

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


export default OrderSuccess;