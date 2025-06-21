import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FoodCarousel from "../FoodComponent/FoodCarousel";

const AddFoodReview = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const location = useLocation();
  const food = location.state;

  const { foodId } = useParams();
  const [userId] = useState(user?.id || "");
  const [star, setStar] = useState("");
  const [review, setReview] = useState("");
  const navigate = useNavigate();

  const saveReview = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login as Customer for adding your review!!!");
      return;
    }

    const data = { userId, foodId, star, review };

    fetch("http://localhost:8080/api/food/review/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
      body: JSON.stringify(data),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });
          setTimeout(() => {
            navigate(`/food/${food.id}/category/${food.category.id}`);
          }, 2000);
        } else {
          toast.error(res.responseMessage || "It seems the server is down!", {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => window.location.reload(true), 2000);
        }
      });
  };

  return (
    <div className="container-fluid mb-5" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}>
      <div className="row">
        <div className="col-sm-2 mt-2"></div>

        <div className="col-sm-3 mt-2">
          <div className="card shadow rounded" style={{ backgroundColor: "#FFFDF2", border: "1px solid #000" }}>
            <FoodCarousel item={{ image1: food.image1, image2: food.image2, image3: food.image3 }} />
          </div>
        </div>

        <div className="col-sm-5 mt-2">
          <div className="card shadow rounded" style={{ backgroundColor: "#FFFDF2", border: "1px solid #000", width: "100%" }}>
            <div className="card-header text-center" style={{ backgroundColor: "#000", color: "#FFFDF2" }}>
              <h5 className="card-title m-0">Add Food Review</h5>
            </div>

            <div className="card-body" style={{ color: "#000" }}>
              <form onSubmit={saveReview}>
                <div className="mb-3">
                  <label className="form-label"><b>Star</b></label>
                  <select
                    className="form-select"
                    value={star}
                    onChange={(e) => setStar(e.target.value)}
                    style={{ backgroundColor: "#FFFDF2", color: "#000", border: "1px solid #000" }}
                  >
                    <option value="">Select Star</option>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="review" className="form-label"><b>Food Review</b></label>
                  <textarea
                    id="review"
                    rows="3"
                    className="form-control"
                    placeholder="Enter your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    style={{ backgroundColor: "#FFFDF2", color: "#000", border: "1px solid #000" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn submit-btn"
                >
                  Add Review
                </button>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFoodReview;
