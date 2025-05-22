import { useEffect, useState } from "react";
import './Product.css'
import PDF from '../../assets/pdf.png'
import Excel from '../../assets/excel.png'
import { FaEdit } from "react-icons/fa";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import User from '../../assets/user.png'
import ProductForm from "../../components/productForm/ProductForm";
import axios from "axios";
import CardSkeleton from "../../components/Ui/Skeleton/Skeleton";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/products/get", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      console.log(res.data)
      setProductData(res.data);
    } catch (error) {
      console.error("failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this product?");
      if (!confirm) return;

      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting.");
    }
  };

  const exportProductsToExcel = (products) => {
    const data = products.map((product, index) => ({
      "S.No": index + 1,
      "Product Name": product.name,
      "Supplier Email": product.supplierEmail,
      Category: product.category,
      HSN: product.hsn,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "products.xlsx");
  };

  const exportProductsToPDF = (products) => {
    const doc = new jsPDF();

    const tableColumn = ["S.No", "Product Name", "Supplier Email", "Category", "HSN"];
    const tableRows = [];

    products.forEach((product, index) => {
      const rowData = [
        index + 1,
        product.name,
        product.supplierEmail,
        product.category,
        product.hsn,
      ];
      tableRows.push(rowData);
    });

    doc.text("Product List", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("products.pdf");
  };

  if (loading) {
    return (
      <div className="product-skeleton">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <CardSkeleton key={i} />
          ))}
      </div>
    );
  }

  const totalPages = Math.ceil(productData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = productData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="product-page">
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <ProductForm
              onClose={handleCloseForm}
              onSuccess={handleSuccess}
              editingProduct={editingProduct}
            />
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="ph1 flex items-center justify-between">
          <button className='back-icon cursor-pointer'><GoArrowLeft /></button>
          <div className="search-bx">
            <input type="text" placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <span><IoSearchOutline /></span>
          </div>
        </div>
        <div className="ph2 flex align-center justify-between">
          <div className="count flex items-center gap-1" style={{ fontSize: "18px" }}>
            <p>Product:</p> <span style={{ fontWeight: "bold" }}>{productData.length}</span>
          </div>
          <div className="export flex items-center gap-6">
            <img src={Excel} alt="" onClick={() => exportProductsToExcel(productData)} style={{ width: "30px", height: "30px", cursor: "pointer" }} />
            <img src={PDF} alt="" onClick={() => exportProductsToPDF(productData)} style={{ height: "28px", marginRight: "40px", cursor: "pointer" }} />
            <button onClick={() => setShowForm(true)} className="add-product"><span><IoMdAdd /></span> Add Product</button>
          </div>
        </div>
      </div>
      <div className="products-section">
        {productData && (
          currentItems.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product, i) => (
            <div className="product-card" key={i}>
              <div className="card-head">
                <img src={product.image ? `http://localhost:8080/uploads/${encodeURIComponent(product.image)}` : User} alt="" />
                <p>{product.name}</p>
              </div>
              <div className="product-info">
                <div className="info-row">
                  <p className="key">Supplier Email</p>
                  <p className="value">: {product.supplierEmail}</p>
                </div>
                <div className="info-row">
                  <p className="key">Category</p>
                  <p className="value">: {product.category}</p>
                </div>
                <div className="info-row">
                  <p className="key">HSN</p>
                  <p className="value">: {product.hsn}</p>
                </div>
              </div>
              <div className="product-actions">
                <button>View Details</button>
                <button onClick={() => handleEdit(product)}><FaEdit /></button>
                <button onClick={() => handleDelete(product._id)}><IoMdTrash /></button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Product;

