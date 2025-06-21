import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewAllFoods = () => {
  const [allFoods, setAllFoods] = useState([]);

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
      "http://localhost:8080/api/food/fetch/all"
    );
    return response.data;
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}>
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{
          height: "auto",
          backgroundColor: "#FFFDF2",
          color: "#000000",
        }}
      >
        <div
          className="card-header text-center"
          style={{
            borderRadius: "1em",
            height: "50px",
            backgroundColor: "#000000",
            color: "#FFFDF2",
          }}
        >
          <h2>All Foods</h2>
        </div>

        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table text-center">
              <thead
                className="table-bordered"
                style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
              >
                <tr>
                  <th scope="col">Food</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Restaurant</th>
                </tr>
              </thead>
              <tbody>
                {allFoods.map((food, index) => (
                  <tr
                    key={food.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFDF2" : "#f1eee5",
                      color: "#000000",
                    }}
                  >
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
                    <td><b>{food.restaurant.firstName}</b></td>
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

export default ViewAllFoods;
