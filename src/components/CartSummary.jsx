import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSummary() {
  const { total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-summary">
      <h2>Order Summary</h2>

      <p>
        Items: <strong>{itemCount}</strong>
      </p>

      <p>
        Total: <strong>₹{total}</strong>
      </p>

      <button
        disabled={itemCount === 0}
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default CartSummary;