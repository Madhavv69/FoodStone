import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const getAllOrders = async () => {
      let allOrders;
      if (orderId) {
        allOrders = await retrieveOrdersById();
      } else {
        allOrders = await retrieveAllorders();
      }

      if (allOrders) {
        setOrders(allOrders.orders);
      }
    };

    getAllOrders();
  }, [orderId]);

  const retrieveAllorders = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/order/fetch/all",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
  };

  const retrieveOrdersById = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/order/fetch?orderId=" + orderId
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  const searchOrderById = (e) => {
    e.preventDefault();
    setOrderId(tempOrderId);
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
          <h2>All Orders</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <form className="row g-3">
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Order Id..."
                onChange={(e) => setTempOrderId(e.target.value)}
                value={tempOrderId}
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFDF2",
                  borderRadius: "0.5rem",
                }}
                onClick={searchOrderById}
              >
                Search
              </button>
            </div>
          </form>

          <div className="table-responsive mt-3">
            <table className="table text-center">
              <thead
                className="table-bordered"
                style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
              >
                <tr>
                  <th>Order Id</th>
                  <th>Food</th>
                  <th>Food Name</th>
                  <th>Category</th>
                  <th>Restaurant</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Customer</th>
                  <th>Order Time</th>
                  <th>Order Status</th>
                  <th>Delivery Person</th>
                  <th>Delivery Contact</th>
                  <th>Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFDF2" : "#f1eee5",
                      color: "#000000",
                    }}
                  >
                    <td><b>{order.orderId}</b></td>
                    <td>
                      <img
                        src={`http://localhost:8080/api/food/${order.food.image1}`}
                        className="img-fluid"
                        alt="food_pic"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{order.food.name}</b></td>
                    <td><b>{order.food.category.name}</b></td>
                    <td><b>{order.food.restaurant.firstName}</b></td>
                    <td><b>{order.food.price}</b></td>
                    <td><b>{order.quantity}</b></td>
                    <td><b>{order.user.firstName}</b></td>
                    <td><b>{formatDateFromEpoch(order.orderTime)}</b></td>
                    <td><b>{order.status}</b></td>
                    <td>
                      <b>
                        {order.deliveryPerson ? (
                          order.deliveryPerson.firstName
                        ) : (
                          <span className="text-danger">Pending</span>
                        )}
                      </b>
                    </td>
                    <td>
                      <b>
                        {order.deliveryPerson ? (
                          order.deliveryPerson.phoneNo
                        ) : (
                          <span className="text-danger">Pending</span>
                        )}
                      </b>
                    </td>
                    <td>
                      <b>
                        {order.deliveryDate ? (
                          `${order.deliveryDate} ${order.deliveryTime}`
                        ) : (
                          <span className="text-danger">Pending</span>
                        )}
                      </b>
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

export default ViewAllOrders;
