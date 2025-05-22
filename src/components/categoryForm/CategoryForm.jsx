import React, { useState, useEffect } from "react";
// import "./HSNForm.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const CategoryForm = ({ onClose, onSuccess, editingCategory }) => {
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingCategory) {
       setCategory(editingCategory.category); // assuming field name is "code"
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingCategory) {
        // update
        await axios.put(`http://localhost:8080/category/update/${editingCategory._id}`, { category }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // add
        await axios.post("http://localhost:8080/category/add", { category }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess(); // to refresh parent list
      onClose(); // close modal
      setCategory("");
    } catch (err) {
      console.error("Error submitting category:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{editingCategory ? "Update Category" : "Add Category"}</h3>
          <button onClick={onClose} className="close-btn"><IoMdClose /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Category
            <input
              type="text"
              name="code"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="submit-btn">
            {editingCategory ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
