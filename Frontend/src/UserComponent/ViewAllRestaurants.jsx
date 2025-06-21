import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewAllRestaurants = () => {
  const [allRestaurant, setAllRestaurant] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllRestaurant(allUsers.users);
      }
    };
    getAllUsers();
  }, []);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/role-wise?role=Restaurant",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const deleteRestaurant = (userId) => {
    fetch(`http://localhost:8080/api/user/delete/restaurant?restaurantId=${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
    })
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
          <h2 className="m-0">All Restaurants</h2>
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
                {allRestaurant.map((restaurant, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#F3F1EC" : "#FFFDF2",
                    }}
                  >
                    <td><b>{restaurant.firstName}</b></td>
                    <td><b>{restaurant.lastName}</b></td>
                    <td><b>{restaurant.emailId}</b></td>
                    <td><b>{restaurant.phoneNo}</b></td>
                    <td>
                      <b>
                        {restaurant.address?.street}, {restaurant.address?.city},{" "}
                        {restaurant.address?.pincode}
                      </b>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteRestaurant(restaurant.id)}
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
                {allRestaurant.length === 0 && (
                  <tr>
                    <td colSpan="6"><b>No restaurants found.</b></td>
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

export default ViewAllRestaurants;
