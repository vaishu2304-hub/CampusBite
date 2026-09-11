import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    }

    if (cart.length === 0) {
      newErrors.cart = "Your cart is empty.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      studentName: name.trim(),
      studentId: studentId.trim(),
      items: cart,
      total: total,
    };

    console.log("Order data:", orderData);

    /*
      TEMPORARY:
      Member 3 will connect the real API here.
    */

    try {
      // Temporary delay only for testing the UI.
      // Replace this with Member 3's createOrder() API.
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      clearCart();

      navigate("/order");
    } catch (error) {
      setErrors({
        submit: "Unable to place order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name</label>

          <input
            type="text"
            value={name}
            maxLength={60}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
          />

          {errors.name && (
            <p className="error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label>Student ID</label>

          <input
            type="text"
            value={studentId}
            maxLength={30}
            onChange={(event) =>
              setStudentId(event.target.value)
            }
            placeholder="Enter your student ID"
          />

          {errors.studentId && (
            <p className="error">
              {errors.studentId}
            </p>
          )}
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <p key={item.id}>
              {item.name} × {item.quantity}
              {" — "}
              ₹{item.price * item.quantity}
            </p>
          ))}

          <h3>Total: ₹{total}</h3>
        </div>

        {errors.submit && (
          <p className="error">
            {errors.submit}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Placing Order..."
            : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;