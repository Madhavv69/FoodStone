import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import FoodCard from "./FoodCard";
import GetFoodReviews from "../ReviewComponent/GetFoodReviews";
import FoodCarousel from "./FoodCarousel";

const Food = () => {
  const { foodId, categoryId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const [quantity, setQuantity] = useState("");
  const [foods, setFoods] = useState([]);
  const [food, setFood] = useState({
    restaurant: {
      firstName: "",
    },
  });

  useEffect(() => {
    const getFood = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/food/fetch?foodId=${foodId}`
      );
      setFood(response.data.foods[0]);
    };

    const getFoodsByCategory = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/food/fetch/category-wise?categoryId=${categoryId}`
      );
      setFoods(response.data.foods);
    };

    getFood();
    getFoodsByCategory();
  }, [foodId, categoryId]);

  const saveFoodToCart = (userId) => {
    fetch("http://localhost:8080/api/cart/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
      body: JSON.stringify({
        quantity: quantity,
        userId: userId,
        foodId: foodId,
      }),
    }).then((result) => {
      result.json().then((res) => {
        const showToast = res.success ? toast.success : toast.error;
        showToast(res.responseMessage, {
          position: "top-center",
          autoClose: 1000,
        });

        setTimeout(() => {
          if (res.success) {
            navigate("/customer/cart");
          } else {
            window.location.reload(true);
          }
        }, 2000);
      });
    });
  };

  const addToCart = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to buy the foods!!!");
    } else if (food.quantity < 1) {
      toast.error("Food Out Of Stock !!!", {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      saveFoodToCart(user.id);
      setQuantity("");
    }
  };

  const navigateToAddReviewPage = () => {
    navigate(`/food/${food.id}/review/add`, { state: food });
  };

  const restaurantFoodPage = () => {
    navigate(
      `/food/restaurant/${food.restaurant.id}/${food.restaurant.firstName}`,
      { state: food.restaurant }
    );
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#FFFDF2", color: "#000" }}>
      <style>
        {`
          .restaurant-name {
            color: red;
            font-weight: bold;
            cursor: pointer;
            transition: text-decoration 0.3s ease;
          }

          .restaurant-name:hover {
            text-decoration: underline;
          }

          .btn-custom {
            background-color: #000;
            color: #FFFDF2;
            transition: all 0.3s ease;
          }

          .btn-custom:hover {
            background-color: #FFFDF2;
            color: #000;
            border: 1px solid #000;
          }
        `}
      </style>

      <div className="row">
        {/* Left Column - Carousel */}
        <div className="col-sm-3 mt-2">
          <div className="card shadow rounded" style={{ backgroundColor: "#FFFDF2" }}>
            <FoodCarousel
              item={{
                image1: food.image1,
                image2: food.image2,
                image3: food.image3,
              }}
            />
          </div>
        </div>

        {/* Middle Column - Food Details */}
        <div className="col-sm-6 mt-2">
          <div className="card shadow rounded" style={{ backgroundColor: "#FFFDF2" }}>
            <div
              className="card-header"
              style={{
                backgroundColor: "#000000",
                color: "#FFFDF2",
                borderRadius: "1em 1em 0 0",
                height: "50px",
              }}
            >
              <h3 className="card-title mb-0">{food.name}</h3>
            </div>

            <div className="card-body">
              <h5><strong>Description:</strong></h5>
              <p>{food.description}</p>

              <h5 className="mt-4"><strong>Restaurant Details:</strong></h5>
              <p onClick={restaurantFoodPage} className="restaurant-name">
                Name: {food.restaurant.firstName}
              </p>
              <p>
                <strong>Contact:</strong> {food.restaurant.emailId}
              </p>

              <div className="mt-3">
                <h4>
                  <strong>Price:</strong> ₹{food.price}
                </h4>
              </div>

              <form className="row g-2 mt-4" onSubmit={addToCart}>
                <div className="col-auto">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Quantity..."
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                    required
                  />
                </div>
                <div className="col-auto">
                  <input
                    type="submit"
                    className="btn btn-custom"
                    value="Add to Cart"
                  />
                </div>
              </form>

              {user && (
                <div className="mt-3">
                  <button
                    className="btn btn-custom"
                    onClick={navigateToAddReviewPage}
                  >
                    Add Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Reviews */}
        <div className="col-sm-3 mt-2">
          <GetFoodReviews />
        </div>
      </div>

      {/* Related Foods Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h3 className="mb-3">Related Foods</h3>
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {foods.map((foodItem, index) => (
              <FoodCard key={index} item={foodItem} />
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Food;
