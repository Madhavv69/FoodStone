import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category/fetch/all");
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/category/delete?categoryId=${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      );
      const res = await response.json();

      if (res.success) {
        toast.success(res.responseMessage);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(res.responseMessage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error occurred!");
    }
  };

  const handleUpdate = (category) => {
    navigate("/admin/category/update", { state: category });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card mx-2 mb-5 shadow-lg"
        style={{ height: "45rem", backgroundColor: "#FFFDF2", border: "1px solid #000000" }}
      >
        <div
          className="card-header text-center"
          style={{
            borderRadius: "1em",
            height: "50px",
            backgroundColor: "#000000",
            color: "#FFFDF2",
          }}
        >
          <h2>All Categories</h2>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table text-center">
              <thead
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFDF2",
                  border: "1px solid #000000",
                }}
              >
                <tr>
                  <th>Category Id</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFDF2" : "#f0f0f0",
                      color: "#000000",
                      borderBottom: "1px solid #000000",
                    }}
                  >
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <button
                        onClick={() => handleUpdate(category)}
                        className="btn btn-sm me-2"
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFDF2",
                          border: "none",
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFDF2",
                          border: "none",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <em>No categories found.</em>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
};

export default ViewAllCategories;
