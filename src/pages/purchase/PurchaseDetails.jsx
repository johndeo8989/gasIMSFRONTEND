import React, { useEffect, useState } from 'react'
import "./PurchaseDetails.css"
import { IoSearchOutline } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import axios from 'axios';
import Img from "../../assets/img.jpeg"
import { MdDelete } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";


const PurchaseDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/purchase/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = Array.isArray(res.data) ? res.data : [res.data];
      console.log(data);
      setPurchases(data);
    } catch (err) {
      console.error("Error fetching purchase data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPurchases = purchases.filter((purchase) => {
    switch (activeFilter) {
      case "Pending":
        return purchase.status?.toLowerCase() !== "approved";
      case "Due":
        return purchase.dueAmount > 0
      case "Paid":
        return purchase.paidStatus?.toLowerCase() === "paid"
      case "All":
      default:
        return true;
    }
  });

  const approvePurchase = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/purchase/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Purchase Approved !");
      fetchData();
    } catch (error) {
      console.error("Error Approving purchase", error);
      alert("Approval Failed");
    }
  }

  const handleDeletePurchase = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this purchase?");
      if (!confirm) return;
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/purchase/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      alert("Purchase deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error", error);
      alert("Something went wrong while deleting");
    }
  }

  return (
    <div className='purchase-details'>
      <div className="page-header">
        <div className="ph1 flex items-center justify-between">
          <button className='back-icon cursor-pointer' onClick={() => navigate('/home')}><GoArrowLeft /></button>
          <div className="search-bx">
            <input type="text" placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <span><IoSearchOutline /></span>
          </div>
        </div>
        <div className="category-bnts">
          <button onClick={() => setActiveFilter("All")} className={activeFilter === "All" ? "active" : ""}>All</button>
          <button onClick={() => setActiveFilter("Pending")} className={activeFilter === "Pending" ? "active" : ""}>Pending</button>
          <button onClick={() => setActiveFilter("Due")} className={activeFilter === "Due" ? "active" : ""}>Due</button>
          <button onClick={() => setActiveFilter("Paid")} className={activeFilter === "Paid" ? "active" : ""}>Paid</button>
          <button className='flex items-center gap-1' style={{ background: "#00006b", color: "white" }} onClick={() => navigate("/addPurchase")}><span style={{ fontSize: "18px" }}><IoAddSharp /></span><span className='addbtn-text'>Add Purchase</span></button>
          <button><FiDownload /></button>
        </div>
      </div>
      <div className="purchase-container mt-3">
        {filteredPurchases.map((purchase) => (
          <div key={purchase._id} className="purchase-card">
            <div className="purchase-info flex">
              <div className="main-info">
                <h3 style={{ color: "#00006b", fontWeight: "600" }}>Dispatch No: {purchase.dispatchNo}</h3>
                <p><strong>Date:</strong> {purchase.date}</p>
                <p><strong>Status:</strong> <span className='purchase-status' style={{ background: purchase.status === "Pending" ? "#ff9900" : "#72ff3b", color: purchase.status === "Pending" ? "white" : "black" }}>{purchase.status}</span></p>
                <p><strong>Total Amount:</strong> ₹{Math.round(purchase.totalPrice)}</p>
                <p><strong>Paid:</strong> ₹{Math.round(purchase.paidAmount)}</p>
                <p><strong>Due Amount:</strong> ₹{Math.round(purchase.dueAmount)}</p>
              </div>
              <div className="supplier-data">
                <h4 style={{ color: "#00006b", fontWeight: "600" }}>Supplier Info</h4>
                <p><strong>Name:</strong> {purchase.supplierDetail.name}</p>
                <p><strong>Email:</strong> {purchase.supplierDetail.email}</p>
                <p><strong>Address:</strong> {purchase.supplierDetail.address}</p>
                <p><strong>Contact:</strong> {purchase.supplierDetail.contact}</p>
              </div>
            </div>

            <h4 style={{ color: "#00006b", fontWeight: "600", margin: "20px 0" }}>Products ({purchase.product.length})</h4>
            <div className="purchase-prod-cards">
              {purchase.product.map((prod, index) => (
                <div key={index} className='prod-card-bady'>
                  <div className="prod-head">
                    <img src={prod.image ? `http://localhost:8080/uploads/${prod.image}` : Img} alt="" />
                    <p style={{ color: "black" }}><strong>{prod.product_Name}</strong></p>
                  </div>
                  <div className="prod-rest">
                    <p><strong>Category:</strong> {prod.category_name}</p>
                    <p><strong>Units:</strong> {prod.noOfUnit}</p>
                    <p><strong>Unit Price:</strong> ₹{prod.perUnitPrice}</p>
                    <p><strong>Total Price:</strong> ₹{Math.round(prod.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="purchase-action flex items-center justify-end mt-2">
              {activeFilter === "Due" && (
                <span style={{ fontSize: "18px" }} className='payment-edit'><FaEdit /></span>
              )}
              {activeFilter === "Pending" && (
                <button onClick={() => approvePurchase(purchase._id)} className='approve-btn'>Approve</button>
              )}
              <span style={{ fontSize: "18px" }} onClick={() => handleDeletePurchase(purchase._id)} className='purchase-delete'><MdDelete /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PurchaseDetails