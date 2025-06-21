import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const ViewRestaurantOrders = () => {
  const restaurant = JSON.parse(sessionStorage.getItem("active-restaurant"));
  const restaurant_jwtToken = sessionStorage.getItem("restaurant-jwtToken");

  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");

  const [assignOrderId, setAssignOrderId] = useState("");
  const [deliveryPersonId, setDeliveryPersonId] = useState("");
  const [allDelivery, setAllDelivery] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getAllOrders = async () => {
      let allOrders = orderId ? await retrieveOrdersById() : await retrieveAllorders();
      if (allOrders) setOrders(allOrders.orders);
    };

    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) setAllDelivery(allUsers.users);
    };

    getAllOrders();
    getAllUsers();
  }, [orderId]);

  const retrieveAllorders = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/order/fetch/restaurant-wise?restaurantId=${restaurant.id}`,
      { headers: { Authorization: "Bearer " + restaurant_jwtToken } }
    );
    return response.data;
  };

  const retrieveAllUser = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/user/fetch/restaurant/delivery-person?restaurantId=${restaurant.id}`,
      { headers: { Authorization: "Bearer " + restaurant_jwtToken } }
    );
    return response.data;
  };

  const retrieveOrdersById = async () => {
    const response = await axios.get(`http://localhost:8080/api/order/fetch?orderId=${orderId}`);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => new Date(Number(epochTime)).toLocaleString();

  const searchOrderById = (e) => {
    e.preventDefault();
    setOrderId(tempOrderId);
  };

  const assignDelivery = (orderId) => {
    setAssignOrderId(orderId);
    handleShow();
  };

  const assignToDelivery = (orderId) => {
    let data = { orderId: assignOrderId, deliveryId: deliveryPersonId };

    fetch("http://localhost:8080/api/order/assign/delivery-person", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + restaurant_jwtToken,
      },
      body: JSON.stringify(data),
    })
      .then((result) => result.json())
      .then((res) => {
        const showToast = res.success ? toast.success : toast.error;
        showToast(res.responseMessage, { position: "top-center", autoClose: 1000 });
        setTimeout(() => window.location.reload(true), 2000);
      })
      .catch(() => {
        toast.error("It seems server is down", { position: "top-center", autoClose: 1000 });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}>
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg">
        <div className="card-header text-center" style={{ backgroundColor: "#000000", color: "#FFFDF2", borderRadius: "1em", height: "50px" }}>
          <h2>Restaurant Orders</h2>
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
                style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
                onClick={searchOrderById}
              >
                Search
              </button>
            </div>
          </form>

          <div className="table-responsive mt-3">
            <table className="table text-center table-bordered">
              <thead style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
                <tr>
                  {[
                    "Order Id", "Food", "Food Name", "Category", "Restaurant", "Price", "Quantity",
                    "Customer", "Order Time", "Order Status", "Delivery Person", "Delivery Contact",
                    "Delivery Time", "Action"
                  ].map((header) => <th key={header}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.orderId} style={{ backgroundColor: index % 2 === 0 ? "#FFFDF2" : "#f0f0f0" }}>
                    <td><b>{order.orderId}</b></td>
                    <td><img src={`http://localhost:8080/api/food/${order.food.image1}`} alt="food" className="img-fluid" style={{ maxWidth: "90px" }} /></td>
                    <td><b>{order.food.name}</b></td>
                    <td><b>{order.food.category.name}</b></td>
                    <td><b>{order.food.restaurant.firstName}</b></td>
                    <td><b>{order.food.price}</b></td>
                    <td><b>{order.quantity}</b></td>
                    <td><b>{order.user.firstName}</b></td>
                    <td><b>{formatDateFromEpoch(order.orderTime)}</b></td>
                    <td><b>{order.status}</b></td>
                    <td>{order.deliveryPerson ? <b>{order.deliveryPerson.firstName}</b> : <b className="text-danger">Pending</b>}</td>
                    <td>{order.deliveryPerson ? <b>{order.deliveryPerson.phoneNo}</b> : <b className="text-danger">Pending</b>}</td>
                    <td>{order.deliveryDate ? <b>{order.deliveryDate + " " + order.deliveryTime}</b> : <b className="text-danger">Processing</b>}</td>
                    <td>
                      {order.deliveryPerson ? (
                        <b>Delivery Assigned</b>
                      ) : (
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
                          onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
                          onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
                          onClick={() => assignDelivery(order.orderId)}
                        >
                          Assign Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
          <Modal.Title>Assign To Delivery Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="m-3">
            <form>
              <div className="mb-3">
                <label className="form-label"><b>Order Id</b></label>
                <input type="text" className="form-control" value={assignOrderId} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label"><b>Delivery Person</b></label>
                <select
                  name="deliveryPersonId"
                  onChange={(e) => setDeliveryPersonId(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Delivery Person</option>
                  {allDelivery.map((delivery) => (
                    <option key={delivery.id} value={delivery.id}>
                      {delivery.firstName + " " + delivery.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <button
                  type="button"
                  onClick={() => assignToDelivery(assignOrderId)}
                  className="btn"
                  style={{ backgroundColor: "#000000", color: "#FFFDF2" }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
                >
                  Assign
                </button>
              </div>

              <ToastContainer />
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewRestaurantOrders;