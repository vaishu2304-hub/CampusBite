import { useCart } from "../context/CartContext";

function FoodCard({ food }) {
  const { addToCart } = useCart();

  return (
    <article className="food-card">

      <div className="food-image-container">
        <img
          src={food.image}
          alt={food.name}
          className="food-image"
        />
      </div>

      <div className="food-info">

        <span className="food-category">
          {food.category}
        </span>

        <h3>{food.name}</h3>

        <div className="food-bottom">

          <span className="food-price">
            ₹{food.price}
          </span>

          <button
            type="button"
            disabled={!food.available}
            onClick={() => addToCart(food)}
          >
            {food.available
              ? "Add to Cart"
              : "Unavailable"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default FoodCard;