import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewRestaurantFoods = () => {
  const restaurant = JSON.parse(sessionStorage.getItem("active-restaurant"));
  const restaurant_jwtToken = sessionStorage.getItem("restaurant-jwtToken");

  const [allFoods, setAllFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllFoods = async () => {
      const allFoods = await retrieveAllFoods();
      if (allFoods) {
        setAllFoods(allFoods.foods);
      }
    };
    getAllFoods();
  }, []);

  const retrieveAllFoods = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/food/fetch/restaurant-wise?restaurantId=" + restaurant.id
    );
    return response.data;
  };

  const deleteFood = (foodId) => {
    fetch(
      `http://localhost:8080/api/food/delete?foodId=${foodId}&restaurantId=${restaurant.id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + restaurant_jwtToken,
        },
      }
    )
      .then((result) => result.json())
      .then((res) => {
        toast[res.success ? "success" : "error"](res.responseMessage, {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => window.location.reload(true), 1000);
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  const updateFood = (food) => {
    navigate("/restaurant/food/update", { state: food });
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}>
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg" style={{ height: "45rem" }}>
        <div
          className="card-header text-center"
          style={{
            borderRadius: "1em",
            height: "50px",
            backgroundColor: "#000000",
            color: "#FFFDF2",
          }}
        >
          <h2>My Foods</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
                <tr>
                  <th>Food</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allFoods.map((food, index) => (
                  <tr key={food.id} style={{ backgroundColor: index % 2 === 0 ? "#FFFDF2" : "#f5f5f5" }}>
                    <td>
                      <img
                        src={`http://localhost:8080/api/food/${food.image1}`}
                        className="img-fluid"
                        alt="food_pic"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{food.name}</b></td>
                    <td><b>{food.description}</b></td>
                    <td><b>{food.category.name}</b></td>
                    <td><b>{food.price}</b></td>
                    <td>
                      <button
                        onClick={() => updateFood(food)}
                        className="btn btn-sm me-2"
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFDF2",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#333";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#000000";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteFood(food.id)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFDF2",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#333";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#000000";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRestaurantFoods;
