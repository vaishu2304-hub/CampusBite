import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <article className="cart-item">

      <div className="cart-item-image">
        <img
          src={item.image}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="cart-item-content">

        <div className="cart-item-info">

          <span className="cart-item-category">
            {item.category}
          </span>

          <h3>{item.name}</h3>

          <p>₹{item.price} each</p>

        </div>

        <div className="cart-item-actions">

          <div className="quantity-controls">

            <button
              type="button"
              onClick={() =>
                decreaseQuantity(item.id)
              }
              aria-label={`Decrease ${item.name}`}
            >
              −
            </button>

            <span>
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                increaseQuantity(item.id)
              }
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>

          </div>

          <button
            type="button"
            className="remove-button"
            onClick={() =>
              removeFromCart(item.id)
            }
          >
            Remove
          </button>

        </div>

      </div>

      <div className="cart-item-price">
        ₹{Number(item.price) * item.quantity}
      </div>

    </article>
  );
}

export default CartItem;