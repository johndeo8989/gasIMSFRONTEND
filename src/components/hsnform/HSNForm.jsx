import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const HSNForm = ({ onClose, onSuccess, editingHSN }) => {
  const [hsn, setHsn] = useState("");

  useEffect(() => {
    if (editingHSN) {
      setHsn(editingHSN.hsn); // assuming field name is "code"
    }
  }, [editingHSN]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingHSN) {
        // update
        await axios.put(`http://localhost:8080/hsn/update/${editingHSN._id}`, { hsn }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // add
        await axios.post("http://localhost:8080/hsn/add", { hsn }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess(); // to refresh parent list
      onClose(); // close modal
      setHsn("");
    } catch (err) {
      console.error("Error submitting HSN:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{editingHSN ? "Update HSN" : "Add HSN"}</h3>
          <button onClick={onClose} className="close-btn"><IoMdClose /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            HSN Code
            <input
              type="text"
              name="code"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="submit-btn">
            {editingHSN ? "Update HSN" : "Add HSN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HSNForm;
