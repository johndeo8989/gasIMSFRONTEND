import React, { useEffect, useState } from 'react'
import './Category.css'
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import CategoryForm from '../../components/categoryForm/CategoryForm';

const Category = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategory = async () => {
        try {
          const res = await axios.get("http://localhost:8080/category/get", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setCategory(res.data);
        } catch (err) {
          console.error("Failed to fetch category", err);
        }
    };
    
  useEffect(() => {
    fetchCategory();
  }, []);

  const handleAddClick = () => {
    setEditingCategory(null); // Add mode
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category); // Edit mode
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/category/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCategory();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };
    
  return (
    <div className='category-page'>

        {isModalOpen && (           
            <CategoryForm                                 
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchCategory}
            editingCategory={editingCategory}
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
                    <p>HSN:</p> <span style={{ fontWeight: "bold" }}>{category.length}</span>
                </div>
                <button onClick={handleAddClick} className="add-category">
                    <span><IoMdAdd /></span> Add Category
                </button>
            </div>
        </div>

        <div className="table-container">
            <table className="tax-table">
                 <thead>
                    <tr>
                        <th>S.no</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {category.map((category, index) => (
                        <tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.category}</td>
                        <td>
                        <div className="actions flex items-center justify-center gap-3">
                                <span
                                    style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
                                    onClick={() => handleEditClick(category)}
                                >
                                    <FaEdit />
                                </span>
                                <span style={{ fontSize: "22px", color: "red", cursor: "pointer" }} onClick={() => handleDelete(category._id)}>
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

export default Category