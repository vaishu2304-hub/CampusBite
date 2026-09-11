import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="cart-item">
      <div>
        <h3>{item.name}</h3>
        <p>₹{item.price} each</p>
      </div>

      <div className="quantity-controls">
        <button onClick={() => decreaseQuantity(item.id)}>
          −
        </button>

        <span>{item.quantity}</span>

        <button onClick={() => increaseQuantity(item.id)}>
          +
        </button>
      </div>

      <p>
        ₹{item.price * item.quantity}
      </p>

      <button
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;