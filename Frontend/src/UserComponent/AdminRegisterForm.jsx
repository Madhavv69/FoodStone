import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AdminRegisterForm = () => {
  let navigate = useNavigate();
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [registerRequest, setRegisterRequest] = useState({});

  const handleUserInput = (e) => {
    setRegisterRequest({ ...registerRequest, [e.target.name]: e.target.value });
  };

  const registerAdmin = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/user/admin/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(registerRequest),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => navigate("/home"), 1000);
          } else {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => window.location.reload(true), 1000);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}
    >
      <div
        className="form-card"
        style={{
          width: "25rem",
          backgroundColor: "#1a1a1a",
          padding: "2rem",
          borderRadius: "1rem",
          color: "#FFFDF2",
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          className="text-center mb-4"
          style={{
            backgroundColor: "#111",
            padding: "0.5rem",
            borderRadius: "0.75rem",
          }}
        >
          <h4 className="m-0" style={{ color: "#FFFDF2" }}>
            Admin Register
          </h4>
        </div>

        <form onSubmit={registerAdmin}>
          <div className="mb-3">
            <label htmlFor="emailId" className="form-label">
              <b>Email Id</b>
            </label>
            <input
              type="email"
              className="form-control"
              id="emailId"
              name="emailId"
              onChange={handleUserInput}
              value={registerRequest.emailId || ""}
              style={{
                backgroundColor: "#333",
                color: "#FFFDF2",
                border: "1px solid #FFFDF2",
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <b>Password</b>
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={handleUserInput}
              value={registerRequest.password || ""}
              autoComplete="on"
              style={{
                backgroundColor: "#333",
                color: "#FFFDF2",
                border: "1px solid #FFFDF2",
              }}
            />
          </div>

          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#FFFDF2",
                color: "#000000",
                fontWeight: "bold",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              Register
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminRegisterForm;
