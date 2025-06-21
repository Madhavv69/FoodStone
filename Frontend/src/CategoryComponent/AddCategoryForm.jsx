import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  const navigate = useNavigate();

  const saveCategory = (e) => {
    e.preventDefault();

    const data = { name, description };

    fetch("http://localhost:8080/api/category/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(data),
    })
      .then((result) =>
        result.json().then((res) => {
          const notify = res.success ? toast.success : toast.error;
          notify(res.responseMessage || "Something went wrong", {
            position: "top-center",
            autoClose: 1000,
          });

          setTimeout(() => {
            res.success ? navigate("/home") : window.location.reload(true);
          }, 2000);
        })
      )
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4" style={{ backgroundColor: "#FFFDF2", minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ width: "26rem", backgroundColor: "#FFFDF2", borderRadius: "1rem", color: "#000000" }}>
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#000000",
            color: "#FFFDF2",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h5 className="m-0">Add Category</h5>
        </div>
        <div className="card-body">
          <form onSubmit={saveCategory}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                <b>Category Title</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Enter title..."
                onChange={(e) => setName(e.target.value)}
                value={name}
                style={{ backgroundColor: "#F3F1EC", color: "#000000" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                <b>Category Description</b>
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                placeholder="Enter description..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                style={{ backgroundColor: "#F3F1EC", color: "#000000" }}
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFDF2",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                Add Category
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;
