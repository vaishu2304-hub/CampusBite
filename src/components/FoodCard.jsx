import { useCart } from "../context/CartContext";

function FoodCard({ food }) {
  const { addToCart } = useCart();

  const isAvailable =
    food.available && Number(food.stock) > 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToCart(food);
  };

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

        <div className="availability">
          {isAvailable ? (
            <>
              <span className="available-dot"></span>
              {food.stock} available
            </>
          ) : (
            <span className="sold-out">
              Sold Out
            </span>
          )}
        </div>

        <div className="food-bottom">

          <span className="food-price">
            ₹{food.price}
          </span>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
          >
            {isAvailable
              ? "Add to Cart"
              : "Sold Out"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default FoodCard;