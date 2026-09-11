import { useEffect, useState } from "react";

import { getFoods } from "../services/api";

import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFoods() {
      try {
        setLoading(true);
        setError("");

        const data = await getFoods();

        setFoods(data);
      } catch (error) {
        setError(
          "Unable to load menu. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>

        <h2>Loading menu...</h2>

        <p>
          Getting today's delicious food.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">

        <h2>
          😕 Something went wrong
        </h2>

        <p>{error}</p>

      </div>
    );
  }

  return (
    <main className="menu-page">

      {/* HERO */}

      <section className="menu-hero">

        <span className="hero-label">
          CAMPUS CANTEEN
        </span>

        <h1>
          Good food.
          <br />
          <span>Less waiting.</span>
        </h1>

        <p>
          Order ahead and skip the canteen queue.
        </p>

      </section>


      {/* MENU */}

      <section className="menu-section">

        <div className="menu-heading">

          <div>

            <h2>
              Today's Menu
            </h2>

            <p>
              Fresh food ready for your break.
            </p>

          </div>

          <span className="food-count">
            {foods.length} items
          </span>

        </div>


        {/* SEARCH */}

        <SearchBar
          search={search}
          setSearch={setSearch}
        />


        {/* FOOD */}

        {filteredFoods.length === 0 ? (

          <div className="empty-search">

            <div className="empty-icon">
              🔍
            </div>

            <h3>
              No food found
            </h3>

            <p>
              Try searching for another food item.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
            >
              Show All Food
            </button>

          </div>

        ) : (

          <div className="food-grid">

            {filteredFoods.map((food) => (

              <FoodCard
                key={food.id}
                food={food}
              />

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Menu;