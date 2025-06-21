import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddCardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const priceToPay = location.state.priceToPay;
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const [card, setCard] = useState({
    cardName: "",
    cardNumber: "",
    validThrough: "",
    cvv: "",
  });

  const handleCardInput = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const payForOrder = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/order/add?userId=" + user.id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => {
              navigate("/home");
            }, 2000);
          } else {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div
      className="mt-2 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#FFFDF2", minHeight: "100vh", padding: "20px" }}
    >
      <div className="card form-card border-color shadow" style={{ width: "25rem" }}>
        <div
          className="card-header"
          style={{
            backgroundColor: "#000000",
            color: "#FFFDF2",
            textAlign: "center",
            borderRadius: "0.5rem 0.5rem 0 0",
          }}
        >
          <h5 className="card-title">Payment Details</h5>
        </div>

        <div className="card-body text-color" style={{ backgroundColor: "#FFFDF2" }}>
          <form onSubmit={payForOrder}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                <b>Name on Card</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="cardName"
                onChange={handleCardInput}
                value={card.cardName}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">
                <b>Card Number</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="cardNumber"
                name="cardNumber"
                onChange={handleCardInput}
                value={card.cardNumber}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="validThrough" className="form-label">
                <b>Valid Through</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="validThrough"
                name="validThrough"
                onChange={handleCardInput}
                value={card.validThrough}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cvv" className="form-label">
                <b>CVV</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="cvv"
                name="cvv"
                onChange={handleCardInput}
                value={card.cvv}
                required
              />
            </div>

            <div className="text-center">
              <input
                type="submit"
                className="btn"
                value={`Pay ₹${priceToPay}`}
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFDF2",
                  padding: "8px 24px",
                  borderRadius: "0.5rem",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#222222";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.transform = "scale(1)";
                }}
              />
            </div>

            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCardDetails;
