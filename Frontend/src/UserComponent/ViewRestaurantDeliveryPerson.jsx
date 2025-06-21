import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewRestaurantDeliveryPerson = () => {
  const [allDelivery, setAllDelivery] = useState([]);

  const restaurant = JSON.parse(sessionStorage.getItem("active-restaurant"));
  const restaurant_jwtToken = sessionStorage.getItem("restaurant-jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllDelivery(allUsers.users);
      }
    };

    getAllUsers();
  }, []);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/user/fetch/restaurant/delivery-person?restaurantId=${restaurant.id}`,
      {
        headers: {
          Authorization: "Bearer " + restaurant_jwtToken,
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const deleteDelivery = (userId) => {
    fetch(
      `http://localhost:8080/api/user/delete/restaurant/delivery-person?deliveryId=${userId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + restaurant_jwtToken,
        },
      }
    )
      .then((result) =>
        result.json().then((res) => {
          const notify = res.success ? toast.success : toast.error;
          notify(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => window.location.reload(true), 1000);
        })
      )
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh", padding: "1rem" }}>
      <div
        className="card shadow-lg mx-auto"
        style={{
          maxWidth: "90%",
          backgroundColor: "#FFFDF2",
          color: "#000000",
          borderRadius: "1rem",
        }}
      >
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#000000",
            color: "#FFFDF2",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 className="m-0">All Delivery Persons</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto", maxHeight: "70vh" }}>
          <div className="table-responsive">
            <table className="table table-bordered text-center" style={{ color: "#000000" }}>
              <thead style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Id</th>
                  <th>Phone No</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allDelivery.map((delivery, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#F3F1EC" : "#FFFDF2",
                    }}
                  >
                    <td><b>{delivery.firstName}</b></td>
                    <td><b>{delivery.lastName}</b></td>
                    <td><b>{delivery.emailId}</b></td>
                    <td><b>{delivery.phoneNo}</b></td>
                    <td>
                      <b>
                        {delivery.address?.street}, {delivery.address?.city},{" "}
                        {delivery.address?.pincode}
                      </b>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteDelivery(delivery.id)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFDF2",
                          borderRadius: "0.5rem",
                          padding: "4px 12px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {allDelivery.length === 0 && (
                  <tr>
                    <td colSpan="6"><b>No delivery persons found.</b></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRestaurantDeliveryPerson;
