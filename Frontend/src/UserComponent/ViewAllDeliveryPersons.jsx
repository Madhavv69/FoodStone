import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewAllDeliveryPersons = () => {
  const [allDelivery, setAllDelivery] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

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
      "http://localhost:8080/api/user/fetch/role-wise?role=Delivery",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  return (
    <div className="mt-3" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh", padding: "1rem" }}>
      <div
        className="card form-card shadow-lg mx-auto"
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
        <div
          className="card-body"
          style={{
            overflowY: "auto",
            maxHeight: "70vh",
          }}
        >
          <div className="table-responsive">
            <table className="table table-bordered text-center" style={{ color: "#000000" }}>
              <thead style={{ backgroundColor: "#000000", color: "#FFFDF2" }}>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Id</th>
                  <th>Phone No</th>
                  <th>Address</th>
                  <th>Restaurant</th>
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
                    <td>
                      <b>{delivery.firstName}</b>
                    </td>
                    <td>
                      <b>{delivery.lastName}</b>
                    </td>
                    <td>
                      <b>{delivery.emailId}</b>
                    </td>
                    <td>
                      <b>{delivery.phoneNo}</b>
                    </td>
                    <td>
                      <b>
                        {delivery.address?.street}, {delivery.address?.city},{" "}
                        {delivery.address?.pincode}
                      </b>
                    </td>
                    <td>
                      <b>{delivery.restaurant?.firstName || "N/A"}</b>
                    </td>
                  </tr>
                ))}
                {allDelivery.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <b>No delivery persons found.</b>
                    </td>
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

export default ViewAllDeliveryPersons;
