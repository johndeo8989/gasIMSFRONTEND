import React, { useEffect, useState } from 'react'
import './Tax.css'
import { GoArrowLeft } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import PDF from '../../assets/pdf.png'
import Excel from '../../assets/excel.png'
import { IoMdAdd } from "react-icons/io";
import Taxform from '../../components/taxform/Taxform';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Tax = () => {
  const [taxes, setTaxes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleForm = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddClick = () => {
    setSelectedTax(null); // Clear selected tax for add
    setIsModalOpen(true);
  };

  const handleEditClick = (tax) => {
    setSelectedTax(tax);
    setIsModalOpen(true);
  };

  const fetchTaxes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/tax/getalltax", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTaxes(res.data);
    } catch (err) {
      console.error("Failed to fetch taxes", err);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tax?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/tax/deletetax/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTaxes(); // refresh list after delete
    } catch (err) {
      console.error("Failed to delete tax", err);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(taxes.map((tax, i) => ({
      "S.No": i + 1,
      "Tax Name": tax.name,
      "Tax Percentage": tax.percentage
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Taxes");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Taxes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["S.No", "Tax Name", "Tax Percentage"];
    const tableRows = taxes.map((tax, index) => [
      index + 1,
      tax.name,
      tax.percentage,
    ]);

    // THIS LINE is important — attach manually
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("taxes.pdf");
  };

  return (
    <div className='taxpage'>
      {isModalOpen && (
        <Taxform
          onClose={toggleForm}
          fetchTaxes={fetchTaxes}
          editData={selectedTax} // Pass selected tax for editing
        />
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
            <p>Tax:</p> <span style={{ fontWeight: "bold" }}>{taxes.length}</span>
          </div>

          <div className="export flex items-center gap-6">
            <img src={Excel} alt="" onClick={exportToExcel} style={{ width: "30px", height: "30px", cursor: "pointer" }} />
            <img src={PDF} alt="" onClick={exportToPDF} style={{ height: "28px", marginRight: "40px", cursor: "pointer" }} />
            <button className='addtax' onClick={handleAddClick}><span><IoMdAdd /></span>Add Tax</button>

          </div>
        </div>
        <div className="table-container">
          <table className="tax-table">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Tax Name</th>
                <th>Tax Percentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {taxes.filter((tax) => tax.name.toLowerCase().includes(searchTerm.toLowerCase())).map((tax, index) => (
                <tr key={tax._id}>
                  <td style={{ minWidth: "40px" }}>{index + 1}</td>
                  <td style={{ minWidth: "120px" }}>{tax.name}</td>

                  <td style={{ minWidth: "150px" }}>{tax.percentage}%</td>

                  <td>
                    <div className="actions flex items-center justify-center gap-3">
                      <span
                        style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
                        onClick={() => handleEditClick(tax)}
                      >
                        <FaEdit />
                      </span>
                      <span style={{ fontSize: "22px", color: "red", cursor: "pointer" }} onClick={() => handleDelete(tax._id)}>
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
    </div>
  );
};

export default Tax;
