import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const restaurant = JSON.parse(sessionStorage.getItem("active-restaurant"));

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    phoneNo: "",
    street: "",
    city: "",
    pincode: "",
    role: "",
  });

  useEffect(() => {
    if (document.URL.indexOf("customer") !== -1) user.role = "Customer";
    else if (document.URL.indexOf("delivery") !== -1) user.role = "Delivery";
    else if (document.URL.indexOf("restaurant") !== -1) user.role = "Restaurant";
  }, []);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (user.role === "Delivery") {
      user.restaurantId = restaurant?.id;
    }

    fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => navigate("/user/login"), 1000);
        } else {
          toast.error(res.responseMessage || "Server error", {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => window.location.reload(), 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => window.location.reload(), 1000);
      });
  };

  return (
    <div style={{ backgroundColor: "#FFFDF2", minHeight: "100vh", padding: "2rem" }}>
      <div className="d-flex align-items-center justify-content-center">
        <div
          className="card p-4 shadow"
          style={{
            width: "50rem",
            backgroundColor: "#FFFDF2",
            borderRadius: "1rem",
            color: "#000000",
          }}
        >
          <div
            className="card-header text-center"
            style={{
              backgroundColor: "#000000",
              color: "#FFFDF2",
              borderRadius: "0.8rem",
              height: "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h5 className="mb-0">Register Here!!!</h5>
          </div>

          <div className="card-body mt-3">
            <form className="row g-3" onSubmit={saveUser}>
              {[
                { label: "First Name", name: "firstName", type: "text" },
                { label: "Last Name", name: "lastName", type: "text" },
                { label: "Email Id", name: "emailId", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Contact No", name: "phoneNo", type: "number" },
                { label: "City", name: "city", type: "text" },
                { label: "Pincode", name: "pincode", type: "number" },
              ].map(({ label, name, type }) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label htmlFor={name} className="form-label">
                    <b>{label}</b>
                  </label>
                  <input
                    type={type}
                    className="form-control"
                    id={name}
                    name={name}
                    value={user[name]}
                    onChange={handleUserInput}
                    required
                    style={{
                      backgroundColor: "#FFFDF2",
                      color: "#000000",
                      border: "1px solid #000000",
                    }}
                  />
                </div>
              ))}

              <div className="col-md-6 mb-3">
                <label htmlFor="street" className="form-label">
                  <b>Street</b>
                </label>
                <textarea
                  className="form-control"
                  id="street"
                  name="street"
                  rows="3"
                  value={user.street}
                  onChange={handleUserInput}
                  style={{
                    backgroundColor: "#FFFDF2",
                    color: "#000000",
                    border: "1px solid #000000",
                  }}
                />
              </div>

              <div className="d-flex align-items-center justify-content-center mt-3">
                <button
                  type="submit"
                  className="btn register-btn"
                >
                  Register User
                </button>
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .register-btn {
          background-color: #000000;
          color: #FFFDF2;
          border-radius: 0.5rem;
          padding: 0.5rem 1.5rem;
          transition: all 0.3s ease;
        }

        .register-btn:hover {
          background-color: #222222;
          color: #FFFDF2;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default UserRegister;
