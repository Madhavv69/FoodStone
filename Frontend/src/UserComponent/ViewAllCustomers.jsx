import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewAllCustomers = () => {
  const [allCustomer, setAllCustomer] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllCustomer(allUsers.users);
      }
    };

    getAllUsers();
  }, []);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/role-wise?role=Customer",
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
          <h2 className="m-0">All Customers</h2>
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
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email Id</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {allCustomer.map((customer, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#F3F1EC" : "#FFFDF2",
                    }}
                  >
                    <td>
                      <b>{customer.firstName}</b>
                    </td>
                    <td>
                      <b>{customer.lastName}</b>
                    </td>
                    <td>
                      <b>{customer.emailId}</b>
                    </td>
                    <td>
                      <b>{customer.phoneNo}</b>
                    </td>
                    <td>
                      <b>
                        {customer.address?.street}, {customer.address?.city}, {customer.address?.pincode}
                      </b>
                    </td>
                  </tr>
                ))}
                {allCustomer.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <b>No customers found.</b>
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

export default ViewAllCustomers;
