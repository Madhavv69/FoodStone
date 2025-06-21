import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryHeader = () => {
  const navigate = useNavigate();

  const deliveryLogout = () => {
    toast.success("Logged out!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    sessionStorage.removeItem("active-delivery");
    sessionStorage.removeItem("delivery-jwtToken");

    setTimeout(() => {
      window.location.reload();
      navigate("/home");
    }, 2000);
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item">
        <Link to="/delivery-person/order/all" className="nav-link">
          <b className="text-color">My Delivery Orders</b>
        </Link>
      </li>

      <li className="nav-item">
        <Link to="#" className="nav-link" onClick={deliveryLogout}>
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default DeliveryHeader;
