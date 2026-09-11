import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:3001";

function Menu() {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load food from JSON Server
  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/foods`);

        if (!response.ok) {
          throw new Error("Failed to load foods");
        }

        const data = await response.json();

        setFoods(data);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load the menu. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  // Search foods
  const filteredFoods = foods.filter((food) =>
    food.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="menu-page">

      {/* ================= HEADER ================= */}

      <header className="menu-header">

        <div className="menu-title">

          <span className="page-label">
            CAMPUS CANTEEN
          </span>

          <h1>CampusBite</h1>

          <p>
            Order your favourite food before reaching
            the canteen.
          </p>

        </div>

        {/* CART BUTTON */}

        <button
          type="button"
          className="cart-button"
          onClick={() => navigate("/cart")}
        >
          🛒 Cart ({itemCount})
        </button>

      </header>


      {/* ================= SEARCH ================= */}

      <section className="search-section">

        <SearchBar
          value={search}
          onChange={setSearch}
        />

      </section>


      {/* ================= LOADING ================= */}

      {loading && (
        <section className="loading-state">

          <div className="spinner"></div>

          <h2>Loading menu...</h2>

          <p>
            Please wait while we load today's food.
          </p>

        </section>
      )}


      {/* ================= ERROR ================= */}

      {!loading && error && (
        <section className="error-state">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </section>
      )}


      {/* ================= EMPTY SEARCH ================= */}

      {!loading &&
        !error &&
        filteredFoods.length === 0 && (
          <section className="empty-state">

            <div className="empty-icon">
              🍽️
            </div>

            <h2>No food found</h2>

            <p>
              We couldn't find any food matching
              "{search}".
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>

          </section>
        )}


      {/* ================= FOOD CARDS ================= */}

      {!loading &&
        !error &&
        filteredFoods.length > 0 && (
          <section className="food-grid">

            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
              />
            ))}

          </section>
        )}

    </main>
  );
}

export default Menu;