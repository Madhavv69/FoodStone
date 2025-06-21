import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewMyCart = () => {
  let user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const [carts, setCarts] = useState([]);
  const [cartAmount, setCartAmount] = useState("0.0");
  let navigate = useNavigate();

  useEffect(() => {
    const getAllCart = async () => {
      const allCart = await retrieveCart();
      if (allCart) {
        setCarts(allCart.carts);
        if (allCart.totalCartAmount) {
          setCartAmount(allCart.totalCartAmount);
        }
      }
    };
    getAllCart();
  }, []);

  const retrieveCart = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/cart/fetch?userId=" + user.id,
      {
        headers: {
          Authorization: "Bearer " + customer_jwtToken,
        },
      }
    );
    return response.data;
  };

  const updateCart = async (cart, newQuantity) => {
    const data = { id: cart.id, userId: user.id, quantity: newQuantity };
    try {
      const response = await fetch("http://localhost:8080/api/cart/update", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + customer_jwtToken,
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      toast[res.success ? "success" : "error"](res.responseMessage, {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("It seems server is down", {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const deleteCart = async (cartId) => {
    const data = { id: cartId, userId: user.id };
    try {
      const response = await fetch("http://localhost:8080/api/cart/delete", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + customer_jwtToken,
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      toast[res.success ? "success" : "error"](res.responseMessage, {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("It seems server is down", {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const checkout = (e) => {
    e.preventDefault();
    if (carts.length < 1) {
      toast.error("No Foods In Cart To Order!!!", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    navigate("/customer/order/payment", { state: { priceToPay: cartAmount } });
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}>
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ backgroundColor: "#FFFDF2", color: "#000000" }}
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
          <h2>My Cart</h2>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table text-center">
              <thead style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
                <tr>
                  <th>Food</th>
                  <th>Food Name</th>
                  <th>Category</th>
                  <th>Restaurant</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((cart, index) => (
                  <tr
                    key={cart.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFDF2" : "#f1eee5",
                      color: "#000000",
                    }}
                  >
                    <td>
                      <img
                        src={`http://localhost:8080/api/food/${cart.food.image1}`}
                        className="img-fluid"
                        alt="food_pic"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{cart.food.name}</b></td>
                    <td><b>{cart.food.category.name}</b></td>
                    <td><b>{cart.food.restaurant.firstName}</b></td>
                    <td><b>{cart.food.price}</b></td>
                    <td>
                      <button
                        onClick={() => updateCart(cart, cart.quantity - 1)}
                        className="btn btn-sm"
                        style={{ backgroundColor: "#000000", color: "#FFFDF2", marginRight: "5px" }}
                      >
                        -
                      </button>
                      <b>{cart.quantity}</b>
                      <button
                        onClick={() => updateCart(cart, cart.quantity + 1)}
                        className="btn btn-sm"
                        style={{ backgroundColor: "#000000", color: "#FFFDF2", marginLeft: "5px" }}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteCart(cart.id)}
                        className="btn btn-sm"
                        style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
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

        <div className="card-footer" style={{ backgroundColor: "#FFFDF2" }}>
          <div className="float-end me-3 text-end">
            <h5 style={{ color: "#000000" }}>Total Price: ₹ {cartAmount}/-</h5>
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyCart;
