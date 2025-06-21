import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewMyOrders = () => {
  let user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getAllOrders = async () => {
      const allOrders = await retrieveCart();
      if (allOrders) {
        setOrders(allOrders.orders);
      }
    };

    getAllOrders();
  }, []);

  const retrieveCart = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/order/fetch/user-wise?userId=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${customer_jwtToken}`,
        },
      }
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh", padding: "20px" }}>
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ height: "40rem", border: "1px solid #000000" }}
      >
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#000000",
            color: "#FFFDF2",
            borderRadius: "1em 1em 0 0",
            height: "50px",
          }}
        >
          <h2 className="m-0">My Orders</h2>
        </div>

        <div className="card-body" style={{ overflowY: "auto", backgroundColor: "#FFFDF2" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead
                className="table-bordered"
                style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
              >
                <tr>
                  <th scope="col">Order Id</th>
                  <th scope="col">Food</th>
                  <th scope="col">Food Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Restaurant</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Order Time</th>
                  <th scope="col">Order Status</th>
                  <th scope="col">Delivery Person</th>
                  <th scope="col">Delivery Contact</th>
                  <th scope="col">Delivery Time</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} style={{ transition: "0.2s" }}>
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
                    <td><b>{formatDateFromEpoch(order.orderTime)}</b></td>
                    <td><b>{order.status}</b></td>
                    <td>
                      <b>
                        {order.deliveryPerson ? order.deliveryPerson.firstName : <span className="text-danger">Pending</span>}
                      </b>
                    </td>
                    <td>
                      <b>
                        {order.deliveryPerson ? order.deliveryPerson.phoneNo : <span className="text-danger">Pending</span>}
                      </b>
                    </td>
                    <td>
                      <b>
                        {order.deliveryDate
                          ? `${order.deliveryDate} ${order.deliveryTime}`
                          : <span className="text-danger">Pending</span>}
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

export default ViewMyOrders;
