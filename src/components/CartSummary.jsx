import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSummary() {
  const {
    cart,
    total,
    itemCount,
  } = useCart();

  const navigate = useNavigate();

  return (
    <aside className="cart-summary">

      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Items</span>
        <strong>{itemCount}</strong>
      </div>

      <div className="summary-row">
        <span>Food Items</span>
        <strong>{cart.length}</strong>
      </div>

      <div className="summary-divider"></div>

      <div className="summary-total">
        <span>Total</span>
        <strong>₹{total}</strong>
      </div>

      <button
        type="button"
        className="checkout-button"
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout
      </button>

      <button
        type="button"
        className="continue-shopping"
        onClick={() => navigate("/")}
      >
        ← Continue Shopping
      </button>

    </aside>
  );
}

export default CartSummary;