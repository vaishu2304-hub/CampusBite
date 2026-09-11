import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <main className="cart-page">

      {/* TOP BAR */}
      <div className="cart-topbar">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Menu
        </button>

        <button
          type="button"
          className="home-cart-button"
          onClick={() => navigate("/cart")}
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      {/* PAGE HEADER */}
      <div className="cart-header">
        <span className="page-label">YOUR ORDER</span>

        <h1>Your Cart</h1>

        <p>
          Review your selected food items before checkout.
        </p>
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your Cart is Empty</h2>

          <p>
            You haven't added any food yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Browse Menu
          </button>
        </section>
      ) : (
        /* CART WITH ITEMS */
        <div className="cart-layout">

          <section className="cart-items-section">

            <div className="cart-items-header">
              <h2>
                Your Items
              </h2>

              <span>
                {cart.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}{" "}
                items
              </span>
            </div>

            <div className="cart-items">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>

          </section>

          <CartSummary />

        </div>
      )}
    </main>
  );
}

export default Cart;