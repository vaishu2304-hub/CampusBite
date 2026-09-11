import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const { addToCart, itemCount } = useCart();
  const navigate = useNavigate();

  const testFood = {
    id: "1",
    name: "Burger",
    price: 50,
  };

  const handleAddToCart = () => {
    addToCart(testFood);
  };

  return (
    <div className="app">
      <h1>🍔 CampusBite</h1>

      <h2>Temporary Testing Page</h2>

      <div className="food-card">
        <h3>{testFood.name}</h3>
        <p>₹{testFood.price}</p>

        <button onClick={handleAddToCart}>
          Add Burger to Cart
        </button>
      </div>

      <div className="cart-test">
        <p>
          Cart Items: <strong>{itemCount}</strong>
        </p>

        <button onClick={() => navigate("/cart")}>
          🛒 Open Cart
        </button>
      </div>
    </div>
  );
}

export default App;