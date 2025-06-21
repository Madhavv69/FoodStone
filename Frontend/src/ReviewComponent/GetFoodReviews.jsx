import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import star from "../images/star.png";

const GetFoodReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("0.0");
  const { foodId } = useParams();

  useEffect(() => {
    const getAllReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/food/review/fetch?foodId=${foodId}`
        );
        if (response.data) {
          setReviews(response.data.reviews);
          setRating(response.data.averageRating);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    getAllReviews();
  }, [foodId]);

  return (
    <div
      className="rounded shadow"
      style={{
        backgroundColor: "#FFFDF2",
        border: "1px solid #000",
        height: "25rem",
        overflow: "hidden",
      }}
    >
      <div
        className="p-3"
        style={{
          backgroundColor: "#000000",
          color: "#FFFDF2",
          fontWeight: "bold",
          borderBottom: "1px solid #000",
        }}
      >
        Food Reviews [Rating: {rating}{" "}
        <img
          src={star}
          alt="rating-star"
          width="18"
          height="18"
          style={{ marginTop: "-3px" }}
        />{" "}
        ]
      </div>

      <div
        style={{
          height: "calc(100% - 50px)",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              className="mb-3 p-2 rounded"
              style={{
                backgroundColor: "#FFFDF2",
                color: "#000000",
                border: "1px solid #ddd",
              }}
            >
              <strong>{review.user.firstName}</strong> –{" "}
              <strong>{review.star} / 5</strong>{" "}
              <img
                src={star}
                alt="star"
                width="18"
                height="18"
                className="mb-1"
              />
              <p className="mt-1 mb-0">{review.review}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#000000" }}>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default GetFoodReviews;
