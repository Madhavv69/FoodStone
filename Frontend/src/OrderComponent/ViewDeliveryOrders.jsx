// Modernized ViewDeliveryOrders.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewDeliveryOrders = () => {
  const deliveryPerson = JSON.parse(sessionStorage.getItem("active-delivery"));
  const delivery_jwtToken = sessionStorage.getItem("delivery-jwtToken");

  const [orders, setOrders] = useState([]);
  const [deliveryUpdateRequest, setDeliveryUpdateRequest] = useState({
    orderId: "",
    deliveryStatus: "",
    deliveryTime: "",
    deliveryDate: "",
    deliveryId: deliveryPerson.id,
  });

  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);

  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");
  const [assignOrderId, setAssignOrderId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleInput = (e) => {
    setDeliveryUpdateRequest({
      ...deliveryUpdateRequest,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const getAllOrders = async () => {
      const allOrders = orderId ? await retrieveOrdersById() : await retrieveAllorders();
      if (allOrders) setOrders(allOrders.orders);
    };

    const getAllDeliveryStatus = async () => {
      const allStatus = await retrieveAllDeliveryStatus();
      if (allStatus) setDeliveryStatus(allStatus);
    };

    const getAllDeliveryTiming = async () => {
      const allTiming = await retrieveAllDeliveryTiming();
      if (allTiming) setDeliveryTime(allTiming);
    };

    getAllOrders();
    getAllDeliveryStatus();
    getAllDeliveryTiming();
  }, [orderId]);

  const retrieveAllorders = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/order/fetch/delivery-wise?deliveryPersonId=${deliveryPerson.id}`,
      {
        headers: { Authorization: `Bearer ${delivery_jwtToken}` },
      }
    );
    return response.data;
  };

  const retrieveAllDeliveryStatus = async () => {
    const response = await axios.get("http://localhost:8080/api/order/fetch/delivery-status/all");
    return response.data;
  };

  const retrieveAllDeliveryTiming = async () => {
    const response = await axios.get("http://localhost:8080/api/order/fetch/delivery-time/all");
    return response.data;
  };

  const retrieveOrdersById = async () => {
    const response = await axios.get(`http://localhost:8080/api/order/fetch?orderId=${orderId}`);
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

  const updateDelivery = (orderId) => {
    setAssignOrderId(orderId);
    handleShow();
  };

  const updateOrderStatus = () => {
    deliveryUpdateRequest.orderId = assignOrderId;
    fetch("http://localhost:8080/api/order/update/delivery-status", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${delivery_jwtToken}`,
      },
      body: JSON.stringify(deliveryUpdateRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage);
          setOrders(res.orders);
          handleClose();
        } else {
          toast.error(res.responseMessage || "Update failed");
        }
      })
      .catch(() => {
        toast.error("Server Error");
      });
  };

  return (
    <div className="container-fluid mt-4" style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
      <h2 className="text-center mb-4 border-bottom pb-2">My Delivery Orders</h2>

      <form className="d-flex gap-3 justify-content-center mb-4" onSubmit={searchOrderById}>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Enter Order Id..."
          onChange={(e) => setTempOrderId(e.target.value)}
          value={tempOrderId}
        />
        <button type="submit" className="btn btn-outline-light">
          Search
        </button>
      </form>

      <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
        <table className="table table-bordered table-dark table-hover text-center">
          <thead className="bg-dark text-warning">
            <tr>
              <th>Order Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Restaurant</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Customer</th>
              <th>Order Time</th>
              <th>Status</th>
              <th>Delivery Person</th>
              <th>Contact</th>
              <th>Delivery Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>
                  <img
                    src={`http://localhost:8080/api/food/${order.food.image1}`}
                    alt="food"
                    style={{ width: "70px" }}
                  />
                </td>
                <td>{order.food.name}</td>
                <td>{order.food.category.name}</td>
                <td>{order.food.restaurant.firstName}</td>
                <td>{order.food.price}</td>
                <td>{order.quantity}</td>
                <td>{order.user.firstName}</td>
                <td>{formatDateFromEpoch(order.orderTime)}</td>
                <td>{order.status}</td>
                <td>{order.deliveryPerson?.firstName || <span className="text-danger">Pending</span>}</td>
                <td>{order.deliveryPerson?.phoneNo || <span className="text-danger">Pending</span>}</td>
                <td>
                  {order.deliveryDate ? (
                    `${order.deliveryDate} ${order.deliveryTime}`
                  ) : (
                    <span className="text-warning">Processing</span>
                  )}
                </td>
                <td>
                  {order.status === "Delivered" ? (
                    <span className="text-success">Delivered</span>
                  ) : (
                    <button className="btn btn-sm btn-outline-light" onClick={() => updateDelivery(order.orderId)}>
                      Update
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header className="bg-dark text-light" closeButton>
          <Modal.Title>Update Delivery Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black text-light">
          <form>
            <div className="mb-3">
              <label>Order ID</label>
              <input type="text" className="form-control bg-dark text-light" value={assignOrderId} disabled />
            </div>
            <div className="mb-3">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                className="form-control bg-dark text-light"
                onChange={handleInput}
                value={deliveryUpdateRequest.deliveryDate}
              />
            </div>
            <div className="mb-3">
              <label>Delivery Time</label>
              <select name="deliveryTime" className="form-control bg-dark text-light" onChange={handleInput}>
                <option value="">Select Delivery Time</option>
                {deliveryTime.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Delivery Status</label>
              <select name="deliveryStatus" className="form-control bg-dark text-light" onChange={handleInput}>
                <option value="">Select Delivery Status</option>
                {deliveryStatus.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="light" onClick={updateOrderStatus}>
            Update
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default ViewDeliveryOrders;
