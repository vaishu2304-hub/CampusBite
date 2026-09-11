import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>🛒 Your Cart is Empty</h1>

        <p>
          Add some delicious food from the menu.
        </p>

        <button onClick={() => navigate("/")}>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <CartSummary />
    </div>
  );
}

export default Cart;