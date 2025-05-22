
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductForm.css";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Img from "../../assets/img.jpeg";

const ProductForm = ({ onClose, onSuccess, editingProduct }) => {
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [category, setCategory] = useState("");
  const [hsn, setHsn] = useState("");

  const [supplierList, setSupplierList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [hsnList, setHsnList] = useState([]);

  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredHsns, setFilteredHsns] = useState([]);

  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showHsnDropdown, setShowHsnDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [suppliers, categories, hsns] = await Promise.all([
          axios.get("http://localhost:8080/supplier/get", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/category/get", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/hsn/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setSupplierList(suppliers.data.suppliers);
        setCategoryList(categories.data);
        setHsnList(hsns.data);
      } catch (error) {
        console.error("Error loading dropdown data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setSupplierEmail(editingProduct.supplierEmail);
      setCategory(editingProduct.category);
      setHsn(editingProduct.hsn);
      setImagePreview(editingProduct.image);
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("supplierEmail", supplierEmail);
    formData.append("category", category);
    formData.append("hsn", hsn);
    if (image) formData.append("image", image);
    
    for (let pair of formData.entries()) {
      if (pair[0] === "image") {
        console.log("Image File Info:");
        console.log("Name:", pair[1].name);
        console.log("Size:", pair[1].size);
        console.log("Type:", pair[1].type);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:8080/products/update/${editingProduct._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:8080/products/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting product:", err);
    }
  };

  const handleFilter = (input, list, setFiltered) => {
    const filtered = list.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(filtered);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{editingProduct ? "Update Product" : "Add Product"}</h3>
          <button onClick={onClose} className="close-btn">
            <IoMdClose />
          </button>
        </div>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="image-field">
            <img
              src={
                imagePreview
                  ? imagePreview.startsWith("blob:")
                    ? imagePreview // preview for newly selected image
                    : `http://localhost:8080/uploads/${encodeURIComponent(imagePreview)}` // image from DB
                  : Img // placeholder image
              }
              alt=""
              className="image-preview"
            />
            <input
              type="file"
              id="fileInput"
              onChange={handleImageChange}
              accept="image/*"
            />
            <label htmlFor="fileInput" className="custom-file-upload">
              <div className="edit-icon">
                <MdEdit />
              </div>
            </label>
          </div>

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          {/* Supplier Email */}
          <div className="custom-select-wrapper">
            <input
              type="text"
              placeholder="Supplier Email"
              value={supplierEmail}
              onChange={(e) => {
                setSupplierEmail(e.target.value);
                handleFilter(
                  e.target.value,
                  supplierList.map((s) => s.email),
                  setFilteredSuppliers
                );
                setShowSupplierDropdown(e.target.value.trim() !== "");
              }}
              onFocus={() => {
                if (supplierEmail.trim() !== "") setShowSupplierDropdown(true)
              }}
              onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 200)}
              required
              className="product-select-input"
            />
            {showSupplierDropdown && filteredSuppliers.length > 0 && (
              <ul className="custom-select-list">
                {filteredSuppliers.map((email, idx) => (
                  <li key={idx} onClick={() => setSupplierEmail(email)}>
                    {email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Category */}
          <div className="custom-select-wrapper">
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleFilter(
                  e.target.value,
                  categoryList.map((c) => c.category),
                  setFilteredCategories
                );
                setShowCategoryDropdown(e.target.value.trim() !== "");
              }}
              onFocus={() => {
                if (category.trim() !== "") setShowCategoryDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
              required
              className="product-select-input"
            />
            {showCategoryDropdown && filteredCategories.length > 0 && (
              <ul className="custom-select-list">
                {filteredCategories.map((c, idx) => (
                  <li key={idx} onClick={() => setCategory(c)}>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* HSN */}
          <div className="custom-select-wrapper">
            <input
              type="text"
              placeholder="HSN"
              value={hsn}
              onChange={(e) => {
                setHsn(e.target.value);
                handleFilter(
                  e.target.value,
                  hsnList.map((h) => h.hsn),
                  setFilteredHsns
                );
                setShowHsnDropdown(e.target.value.trim() !== "");
              }}
              onFocus={() => {
                if (hsn.trim() !== "") setShowHsnDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowHsnDropdown(false), 200)}
              required
              className="product-select-input"
            />
            {showHsnDropdown && filteredHsns.length > 0 && (
              <ul className="custom-select-list">
                {filteredHsns.map((code, idx) => (
                  <li key={idx} onClick={() => setHsn(code)}>
                    {code}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit">
            {editingProduct ? "Update" : "Add"} Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
