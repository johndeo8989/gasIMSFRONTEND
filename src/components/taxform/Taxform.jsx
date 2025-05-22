import React, { useState } from "react";
import "./Taxform.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const Taxform = ({ onClose, fetchTaxes, editData }) => {
  const [form, setForm] = useState({
    name: editData ? editData.name : "",
    percentage: editData ? editData.percentage : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const updateTax = async () => {
    try {
      await axios.put(`http://localhost:8080/tax/updatetax/${editData._id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTaxes();
      onClose();
    } catch (err) {
      console.error("Error updating tax", err);
    }
  };
  const addTax =  async () => {
    try {
      await axios.post("http://localhost:8080/tax/addtax", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onClose();
      setForm({ name: "", percentage: "" });
      fetchTaxes(); 
    } catch (err) {
      console.error("Error adding tax", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      updateTax();
    } else {
      addTax();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{editData ? "Update Tax" : "Add Tax"}</h3>
          <button onClick={onClose} className="close-btn"><IoMdClose /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Tax name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tax per
            <input
              type="number"
              name="percentage"
              value={form.percentage}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="submit-btn">{editData ? "Update Tax" : "Add Tax"}</button>
        </form>
      </div>
    </div>
  );
};

export default Taxform;
