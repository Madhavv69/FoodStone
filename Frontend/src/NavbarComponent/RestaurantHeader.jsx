import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantHeader = () => {
  const navigate = useNavigate();

  const restaurantLogout = () => {
    toast.success("Logged out!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    sessionStorage.removeItem("active-restaurant");
    sessionStorage.removeItem("restaurant-jwtToken");

    setTimeout(() => {
      window.location.reload();
      navigate("/home");
    }, 2000);
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item">
        <Link to="/restaurant/order/all" className="nav-link">
          <b className="text-color">Restaurant Orders</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/restaurant/delivery/register" className="nav-link">
          <b className="text-color">Register Delivery</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/restaurant/delivery-person/all" className="nav-link">
          <b className="text-color">View Delivery Persons</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/food/add" className="nav-link">
          <b className="text-color">Add Food</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/restaurant/food/all" className="nav-link">
          <b className="text-color">View My Foods</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="#" className="nav-link" onClick={restaurantLogout}>
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default RestaurantHeader;
