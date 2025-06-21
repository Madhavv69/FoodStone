import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateCategoryForm = () => {
  const location = useLocation();
  const category = location.state;
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [id, setId] = useState(category.id);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);

  const navigate = useNavigate();

  const saveCategory = async (e) => {
    e.preventDefault();
    const data = { id, name, description };

    try {
      const response = await fetch("http://localhost:8080/api/category/update", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + admin_jwtToken,
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });
        setTimeout(() => navigate("/admin/category/all"), 2000);
      } else {
        toast.error(res.responseMessage || "Something went wrong", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("It seems the server is down", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div
        className="card shadow-lg"
        style={{
          width: "30rem",
          backgroundColor: "#FFFDF2",
          border: "1px solid #000000",
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
          }}
        >
          <h4 className="my-2">Update Category</h4>
        </div>

        <div className="card-body" style={{ color: "#000000" }}>
          <form onSubmit={saveCategory}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-bold">
                Category Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Enter category title..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #000000",
                  color: "#000",
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-bold">
                Category Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #000000",
                  color: "#000",
                }}
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFDF2",
                  padding: "8px 24px",
                  borderRadius: "0.5rem",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#333333";
                  e.target.style.color = "#FFFDF2";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.color = "#FFFDF2";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Update Category
            </button>

            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateCategoryForm;
