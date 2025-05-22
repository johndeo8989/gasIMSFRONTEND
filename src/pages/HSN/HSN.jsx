import React, { useState, useEffect } from "react";
import "./HSN.css";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import HSNForm from "../../components/hsnform/HSNForm";
import axios from "axios";

const HSN = () => {
    const [hsns, setHsns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHSN, setEditingHSN] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchHSNs = async () => {
        try {
          const res = await axios.get("http://localhost:8080/hsn/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log(res.data)
          setHsns(res.data);
        } catch (err) {
          console.error("Failed to fetch HSNs", err);
        }
      };
    
      useEffect(() => {
        fetchHSNs();
      }, []);
    
      const handleAddClick = () => {
        setEditingHSN(null); // Add mode
        setIsModalOpen(true);
      };
    
      const handleEditClick = (hsn) => {
        setEditingHSN(hsn); // Edit mode
        setIsModalOpen(true);
      };
    
      const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this HSN?");
        if (!confirmDelete) return;
    
        try {
          await axios.delete(`http://localhost:8080/hsn/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          fetchHSNs();
        } catch (err) {
          console.error("Failed to delete HSN", err);
        }
      };

  return (
    <div className='hsn-page'>  {/*  note:- HSN Form css code in Taxform.css  */}   
        {isModalOpen && (           
            <HSNForm                                 
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchHSNs}
            editingHSN={editingHSN}
            />
        )}
        <div className="page-header">  {/*  note:- all page-header css code in tax.css  */}
            <div className="ph1 flex items-center justify-between">
                <button className='back-icon cursor-pointer'><GoArrowLeft /></button>
                <div className="search-bx">
                    <input type="text" placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <span><IoSearchOutline /></span>
                </div>
            </div>
            <div className="ph2 flex items-center justify-between">
                <div className="count flex items-center gap-1" style={{ fontSize: "18px" }}>
                    <p>HSN:</p> <span style={{ fontWeight: "bold" }}>{hsns.length}</span>
                </div>
                <button onClick={handleAddClick} className="add-hsn">
                   <span><IoMdAdd /></span> Add HSN
                </button>
            </div>
        </div>
        <div className="table-container">  {/*  note:- all table css code in tax.css  */}
                <table className="tax-table">
                <thead>
                <tr>
                    <th>S.no</th>
                    <th>HSN Code</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {hsns.map((hsn, index) => (
                    <tr key={hsn._id}>
                    <td>{index + 1}</td>
                    <td>{hsn.hsn}</td>
                    <td>
                       <div className="actions flex items-center justify-center gap-3">
                            <span
                                style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
                                onClick={() => handleEditClick(hsn)}
                            >
                                <FaEdit />
                            </span>
                            <span style={{ fontSize: "22px", color: "red", cursor: "pointer" }} onClick={() => handleDelete(hsn._id)}>
                                <IoMdTrash />
                            </span>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default HSN