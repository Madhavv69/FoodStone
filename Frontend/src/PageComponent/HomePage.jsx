import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FoodCard from "../FoodComponent/FoodCard";
import Carousel from "./Carousel";
import Footer from "../NavbarComponent/Footer";

const HomePage = () => {
  const { categoryId } = useParams();
  const [foods, setFoods] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [tempSearchText, setTempSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (!categoryId && searchText === "") {
          response = await axios.get(`http://localhost:8080/api/food/fetch/all`);
        } else if (searchText) {
          response = await axios.get(
            `http://localhost:8080/api/food/search?foodName=${searchText}`
          );
        } else {
          response = await axios.get(
            `http://localhost:8080/api/food/fetch/category-wise?categoryId=${categoryId}`
          );
        }

        if (response.data) {
          setFoods(response.data.foods);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [categoryId, searchText]);

  const searchFoods = (e) => {
    e.preventDefault();
    if (tempSearchText.trim() === "") {
      // If input is empty, fetch all
      setSearchText("");
    } else {
      setSearchText(tempSearchText.trim());
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#FFFDF2",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      <Carousel />

      {/* Search Bar */}
      <div className="d-flex align-items-center justify-content-center mt-5">
        <form className="row g-3" onSubmit={searchFoods}>
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Food Name..."
              onChange={(e) => setTempSearchText(e.target.value)}
              value={tempSearchText}
              style={{
                width: "350px",
                backgroundColor: "#FFFDF2",
                borderColor: "#000000",
                color: "#000000",
              }}
            />
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn mb-3"
              style={{
                backgroundColor: "#000000",
                color: "#FFFDF2",
                border: "1px solid #000000",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#FFFDF2";
                e.target.style.color = "#000000";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#000000";
                e.target.style.color = "#FFFDF2";
              }}
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Foods */}
      <div className="col-md-12 mt-4 mb-5">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {foods.map((food) => (
            <FoodCard item={food} key={food.id} />
          ))}
        </div>
      </div>

      <hr style={{ borderTop: "1px solid #000000" }} />
      <Footer />
    </div>
  );
};

export default HomePage;
