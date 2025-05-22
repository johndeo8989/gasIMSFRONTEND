import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import f1 from "../../assets/f1.png";
import f2 from "../../assets/f2.png";
import f3 from "../../assets/f3.png";
import f4 from "../../assets/f4.png";
import f5 from "../../assets/f5.png";
import f6 from "../../assets/f6.png";
import f7 from "../../assets/f7.png";
import f8 from "../../assets/f8.png";
import f9 from "../../assets/f9.png";
import f10 from "../../assets/f10.png";
import f11 from "../../assets/f11.png";
import f12 from "../../assets/f12.png";
import Hsn from "../../assets/hsn.png";
import category from "../../assets/category.png";

const Sidebar = ({ isExpand, onLinkClick }) => {
  const [activeMenu, setActiveMenu] = useState("sell");
  return (
    <div className="sidebar">
      <Link
        to="/sell"
        className={`link ${activeMenu === "sell" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("sell");
          onLinkClick && onLinkClick();
        }}
      >
        <img src={f9} alt="" style={{ width: "18px", marginLeft: "10px" }} />
        {isExpand && (
          <span>Sale</span>
        )}
      </Link>
      <Link
        to="/purchase"
        className={`link ${activeMenu === "purchase" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("purchase");
          onLinkClick && onLinkClick();
        }}
      >
        <img src={f8} alt="" /> {isExpand && <span>My Purchase</span>}
      </Link>
      <Link to="/supplier" className={`link ${activeMenu === "supplier" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("supplier");
          onLinkClick && onLinkClick();
        }}>
        <img src={f7} alt="" /> {isExpand && <span>My Supplier</span>}
      </Link>
      <Link to="/product" className={`link ${activeMenu === "product" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("product");
          onLinkClick && onLinkClick();
        }}>
        <img src={f1} alt="" style={{ width: "25px" }} /> {isExpand && <span>Product</span>}
      </Link>
      <Link to="/customer" className={`link ${activeMenu === "customer" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("customer");
          onLinkClick && onLinkClick();
        }}>
        <img src={f11} alt="" style={{ width: "24px" }} />{" "}
        {isExpand && <span>My Customer</span>}
      </Link>

      <Link to="/tax" className={`link ${activeMenu === "tax" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("tax");
          onLinkClick && onLinkClick();
        }}>
        <img src={f12} alt="" /> {isExpand && <span>Tax</span>}
      </Link>
      <Link to="/vendors" className={`link ${activeMenu === "vendors" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("vendors");
          onLinkClick && onLinkClick();
        }}>
        <img src={f6} alt="" /> {isExpand && <span>Vendors</span>}
      </Link>
      <Link to="/stock" className={`link ${activeMenu === "stock" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("stock");
          onLinkClick && onLinkClick();
        }}>
        <img src={f4} alt="" /> {isExpand && <span>Stock</span>}
      </Link>
      <Link to="/profit" className={`link ${activeMenu === "profit" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("profit");
          onLinkClick && onLinkClick();
        }}>
        <img src={f3} alt="" /> {isExpand && <span>Profit</span>}
      </Link>
      <Link to="/profile" className={`link ${activeMenu === "profile" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("profile");
          onLinkClick && onLinkClick();
        }}>
        <img src={f10} alt="" /> {isExpand && <span>Profile</span>}
      </Link>
      <Link to="/expense/overview" className={`link ${activeMenu === "expense" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("expense");
          onLinkClick && onLinkClick();
        }}>
        <img src={f5} alt="" /> {isExpand && <span>Expense</span>}
      </Link>
      <Link to="/employee" className={`link ${activeMenu === "employee" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("employee");
          onLinkClick && onLinkClick();
        }}>
        <img src={f2} alt="" /> {isExpand && <span>Employee</span>}
      </Link>
      <Link to="/hsn" className={`link ${activeMenu === "hsn" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("hsn");
          onLinkClick && onLinkClick();
        }}>
        <img src={Hsn} alt="" /> {isExpand && <span>HSN</span>}
      </Link>
      <Link to="/category" className={`link ${activeMenu === "category" ? "active" : ""}`}
        onClick={() => {
          setActiveMenu("category");
          onLinkClick && onLinkClick();
        }}>
        <img src={category} alt="" /> {isExpand && <span>Category</span>}
      </Link>
    </div>
  );
};

export default Sidebar;
