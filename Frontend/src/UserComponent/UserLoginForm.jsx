import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserLoginForm = () => {
  const navigate = useNavigate();

  const [loginRequest, setLoginRequest] = useState({
    emailId: "",
    password: "",
    role: "",
  });

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const loginAction = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success && res.jwtToken !== null) {
          const role = res.user.role;
          const userKey = `active-${role.toLowerCase()}`;
          const tokenKey = `${role.toLowerCase()}-jwtToken`;

          sessionStorage.setItem(userKey, JSON.stringify(res.user));
          sessionStorage.setItem(tokenKey, res.jwtToken);

          toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });
          setTimeout(() => {
            window.location.href = "/home";
          }, 1000);
        } else {
          toast.error(res.responseMessage || "Invalid credentials", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      })
      .catch(() => {
        toast.error("Server error. Try again later.", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#FFFDF2" }}
    >
      <div
        className="card p-4 border-0 shadow"
        style={{
          width: "26rem",
          borderRadius: "1rem",
          backgroundColor: "#FFFDF2",
          color: "#000000",
        }}
      >
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#000000",
            color: "#FFFDF2",
            borderRadius: "0.8rem",
          }}
        >
          <h4 className="mb-0">User Login</h4>
        </div>

        <div className="card-body mt-3">
          <form onSubmit={loginAction}>
            <div className="mb-3">
              <label className="form-label"><b>User Role</b></label>
              <select
                name="role"
                className="form-select custom-select"
                onChange={handleUserInput}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Delivery">Delivery Person</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Email Id</b></label>
              <input
                type="email"
                className="form-control"
                name="emailId"
                value={loginRequest.emailId}
                onChange={handleUserInput}
                required
                style={{
                  backgroundColor: "#FFFDF2",
                  color: "#000000",
                  border: "1px solid #000000",
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Password</b></label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={loginRequest.password}
                onChange={handleUserInput}
                autoComplete="on"
                required
                style={{
                  backgroundColor: "#FFFDF2",
                  color: "#000000",
                  border: "1px solid #000000",
                }}
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn login-btn"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>

      {/* Scoped styles */}
      <style>{`
        .custom-select {
          background-color: #FFFDF2;
          color: #000000;
          border: 1px solid #000000;
        }

        .custom-select:focus {
          border-color: #000000;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          background-color: #FFFDF2;
          color: #000000;
        }

        .login-btn {
          background-color: #000000;
          color: #FFFDF2;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background-color: #222222;
          color: #FFFDF2;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default UserLoginForm;
