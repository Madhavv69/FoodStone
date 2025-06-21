import { Link } from "react-router-dom";
import CategoryNavigator from "../CategoryComponent/CategoryNavigator";

const FoodCard = (food) => {
  const descriptionToShow = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + "...";
    }
  };

  return (
    <div className="col">
      <div
        className="card h-100 shadow-sm"
        style={{
          backgroundColor: "#FFFDF2",
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <img
          src={`http://localhost:8080/api/food/${food.item.image1}`}
          className="card-img-top"
          alt={food.item.name}
          style={{
            objectFit: "cover",
            maxHeight: "200px",
            borderBottom: "1px solid #ddd",
          }}
        />

        <div className="card-body" style={{ color: "#000000" }}>
          <h6 style={{ fontSize: "0.9rem", opacity: 0.7 }}>
            Category:{" "}
            <CategoryNavigator
              item={{
                id: food.item.category.id,
                name: food.item.category.name,
              }}
            />
          </h6>

          <h5 className="card-title mt-2" style={{ fontWeight: "bold" }}>
            {food.item.name}
          </h5>

          <p className="card-text" style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>
            {descriptionToShow(food.item.description, 50)}
          </p>
        </div>

        <div className="card-footer bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <Link
              to={`/food/${food.item.id}/category/${food.item.category.id}`}
              className="btn add-to-cart-btn"
            >
              Add to Cart
            </Link>

            <h6 style={{ margin: 0, fontWeight: "bold", color: "#000000" }}>
              ₹{food.item.price}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
