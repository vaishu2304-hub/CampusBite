import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

function Checkout() {

  const navigate = useNavigate();

  const {
    cart,
    total,
    clearCart
  } = useCart();

  const [name, setName] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  if (cart.length === 0) {

    return (
      <main className="checkout-page">

        <div className="checkout-card">

          <h2>
            Your cart is empty
          </h2>

          <button
            type="button"
            className="continue-shopping"
            onClick={() => navigate("/")}
          >
            ← Back to Menu
          </button>

        </div>

      </main>
    );
  }


  async function handleSubmit(event) {

    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");


    const cleanName =
      name.trim();

    const cleanStudentId =
      studentId.trim();


    if (!cleanName) {

      setError(
        "Please enter your student name."
      );

      return;
    }


    if (!cleanStudentId) {

      setError(
        "Please enter your student ID."
      );

      return;
    }


    setSubmitting(true);


    try {

      const orderData = {

        name: cleanName,

        studentId:
          cleanStudentId,

        items: cart.map(item => ({
          id: item.id,

          quantity:
            Number(item.quantity)
        }))
      };


      console.log(
        "ORDER DATA:",
        orderData
      );


      const order =
        await createOrder(
          orderData
        );


      console.log(
        "CREATED ORDER:",
        order
      );


      localStorage.setItem(
        "campusbite-last-order",
        JSON.stringify(order)
      );


      clearCart();


      navigate(
        "/order-success"
      );

    } catch (error) {

      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to place order. Please try again."
      );

    } finally {

      setSubmitting(false);

    }
  }


  return (
    <main className="checkout-page">

      <div className="page-header">

        <div>

          <span className="page-label">
            CHECKOUT
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your student details to place your order.
          </p>

        </div>

      </div>


      <div className="checkout-layout">

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="student-name">
              Student Name
            </label>

            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              maxLength={100}
              disabled={submitting}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="student-id">
              Student ID
            </label>

            <input
              id="student-id"
              type="text"
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  e.target.value
                )
              }
              placeholder="Enter your student ID"
              maxLength={50}
              disabled={submitting}
              required
            />

          </div>


          {error && (

            <div className="form-error">
              ⚠️ {error}
            </div>

          )}


          <button
            type="submit"
            className="place-order-button"
            disabled={submitting}
          >

            {submitting
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </form>


        <aside className="checkout-summary">

          <h2>
            Your Order
          </h2>

          {cart.map(item => (

            <div
              className="checkout-item"
              key={item.id}
            >

              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹
                {Number(item.price) *
                  Number(item.quantity)}
              </strong>

            </div>

          ))}


          <div className="summary-divider"></div>


          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {Number(total).toFixed(0)}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;