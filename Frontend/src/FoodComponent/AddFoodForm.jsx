import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const AddFoodForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedImage1, setSelectImage1] = useState(null);
  const [selectedImage2, setSelectImage2] = useState(null);
  const [selectedImage3, setSelectImage3] = useState(null);
  const [food, setFood] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const restaurant = JSON.parse(sessionStorage.getItem("active-restaurant"));
  const restaurant_jwtToken = sessionStorage.getItem("restaurant-jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllCategories = async () => {
      const res = await axios.get("http://localhost:8080/api/category/fetch/all");
      setCategories(res.data.categories);
    };
    getAllCategories();
  }, []);

  const handleInput = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const saveFood = async (e) => {
    e.preventDefault();
    if (!restaurant) {
      toast.error("Restaurant Id is missing!");
      return;
    }
    const formData = new FormData();
    formData.append("image1", selectedImage1);
    formData.append("image2", selectedImage2);
    formData.append("image3", selectedImage3);
    formData.append("name", food.name);
    formData.append("description", food.description);
    formData.append("price", food.price);
    formData.append("categoryId", food.categoryId);
    formData.append("restaurantId", restaurant.id);

    try {
      const resp = await axios.post("http://localhost:8080/api/food/add", formData, {
        headers: {
          Authorization: `Bearer ${restaurant_jwtToken}`,
        },
      });

      if (resp.data.success) {
        toast.success(resp.data.responseMessage);
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(resp.data.responseMessage);
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFDF2', minHeight: '100vh', padding: '2rem' }}>
      <div className="container" style={{ maxWidth: '800px', backgroundColor: '#000', borderRadius: '12px', padding: '2rem', boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}>
        <h2 className="text-center mb-4" style={{ color: '#FFFDF2' }}>Add New Food Item</h2>
        <form onSubmit={saveFood}>
          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Food Title</b></label>
            <input type="text" name="name" className="form-control" style={{ backgroundColor: '#fff', color: '#000' }} value={food.name} onChange={handleInput} />
          </div>

          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Description</b></label>
            <textarea name="description" className="form-control" style={{ backgroundColor: '#fff', color: '#000' }} rows="3" value={food.description} onChange={handleInput}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Price</b></label>
            <input type="number" name="price" className="form-control" style={{ backgroundColor: '#fff', color: '#000' }} value={food.price} onChange={handleInput} />
          </div>

          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Category</b></label>
            <select name="categoryId" className="form-select" style={{ backgroundColor: '#fff', color: '#000' }} onChange={handleInput}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Select 1st Image</b></label>
            <input type="file" className="form-control" onChange={(e) => setSelectImage1(e.target.files[0])} />
          </div>
          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Select 2nd Image</b></label>
            <input type="file" className="form-control" onChange={(e) => setSelectImage2(e.target.files[0])} />
          </div>
          <div className="mb-3">
            <label className="form-label"><b style={{ color: '#FFFDF2' }}>Select 3rd Image</b></label>
            <input type="file" className="form-control" onChange={(e) => setSelectImage3(e.target.files[0])} />
          </div>

          <div className="text-center">
            <button type="submit" className="btn" style={{ backgroundColor: '#FFFDF2', color: '#000000', padding: '0.5rem 2rem', borderRadius: '8px' }}>Add Food</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddFoodForm;
