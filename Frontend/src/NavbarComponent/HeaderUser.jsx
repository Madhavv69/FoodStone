import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderUser = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    toast.success("Logged out!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    sessionStorage.removeItem("active-customer");
    sessionStorage.removeItem("customer-jwtToken");

    setTimeout(() => {
      window.location.reload();
      navigate("/home");
    }, 2000);
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item">
        <Link to="/customer/cart" className="nav-link">
          <b className="text-color">My Cart</b>
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/customer/order" className="nav-link">
          <b className="text-color">My Order</b>
        </Link>
      </li>

      <li className="nav-item">
        <Link to="#" className="nav-link" onClick={userLogout}>
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default HeaderUser;
