import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaSearch } from 'react-icons/fa'
import { IoFilterSharp } from 'react-icons/io5'
import pdf from './pdf.png'
import excel from './excel.png'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useFormContext } from "../../context/DisplayForm/FormContext";
import { FiPlus } from "react-icons/fi";
import jsPDF from "jspdf";
import styles from './employee.module.css'
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { RxCross2 } from "react-icons/rx";
import * as XLSX from "xlsx"; import { MdDelete } from "react-icons/md";
import axios from 'axios'; import { MdOutlineModeEdit } from "react-icons/md";
import { handleError } from '../../utils/utils'
import AddEmployee from '../../components/Ui/form/Add/AddEmployee'
import UpdateEmployee from '../../components/Ui/form/UpdateEmployee'
const Employee = () => {
    const { isFormOpen, toggleForm } = useFormContext();
    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/employee/all", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
            console.log(res.data)
            setBills((res.data.employee).reverse())
            setData((res.data.employee).reverse())

        } catch (error) {
            console.error("failed to fetch product", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    const [data, setData] = useState([]);
    const [bills, setBills] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const handleClick = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (
            direction === "next" &&
            currentPage < Math.ceil(bills.length / itemsPerPage)
        ) {
            setCurrentPage(currentPage + 1);
        }
    };
    console.log(bills, 'hihi')
    const handleSearchChange = (e) => {
        if (e.target.value) {
            setBills(
                [...data].reverse().filter((data) =>
                    (data.date?.toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.empName?.toString().toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.empID?.toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.desig?.toLowerCase().includes(e.target.value.toLowerCase()))
                )
            );
        } else {
            setBills([...data].reverse());
        }
    }

    const [date, setDate] = useState('')
    const onDateChange = (e) => {
        setDate(e.target.value)
        setBills(data.filter(bill => bill.date.split('T')[0] === e.target.value))
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBills = bills.slice(indexOfFirstItem, indexOfLastItem);
    console.log("bills:", bills);
    const exportProductsToPDF = (bills) => {
        const doc = new jsPDF();
        const tableColumn = ["S.No", "Date", "Employee Name", 'Emp.ID	', "Designation",];
        const tableRows = [];
        bills.forEach((bill, index) => {
            const rowData = [
                index + 1,
                bill.date?.split('T')[0],
                bill.empName,
                bill.empID,
                bill.desig,
            ];
            tableRows.push(rowData);
        });
        doc.text("Total Employees", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 }

        });
        doc.save("Employees.pdf");
    };
    const exportProductsToExcel = (bills) => {
        const data = bills.map((bill, index) => ({
            "S.No": index + 1,
            "Date": bill.date?.split('T')[0],
            "Employee Name": bill.empName,
            'Emp.ID': bill.empID,
            "Designation": bill.desig,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
        XLSX.writeFile(workbook, "Employees.xlsx");
    };
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 480); // adjust the width as needed
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/employee/${id}`);
            handleError('Expense deleted:');
            console.log(response)
            fetchData()
        } catch (error) {
            console.error('Error deleting expense:', error.message);
        }
    };

    const [employeeData, setEmployeeData] = useState()
    const [edit, setEdit] = useState(false)

    return (
        <div className='block sm:flex relative mt-4'>
            {isFormOpen &&
                <div className={`absolute form-container bg-red-300 w-full h-screen`}>
                    {edit ?
                        <UpdateEmployee setEdit={setEdit} fetchData={fetchData} employeeData={employeeData} /> : <AddEmployee setEdit={setEdit} fetchData={fetchData} />
                    }

                </div>
            }
            <div className='sm:pr-5 flex-1'>
                <div className={styles.overviewcontainer}>
                    <div className={styles.right}>
                        <div className='flex gap-3 items-center'>
                            <button>
                                <FaArrowLeft />
                            </button>
                            <p>Overview</p>
                        </div>
                    </div>
                    <div className={styles.left}>
                        <span className='flex items-center gap-2'>
                            <input type="date" value={date} onChange={onDateChange} className={styles.date} />
                            {date && <RxCross2 onClick={() => { setBills([...data].reverse()); setDate('') }
                            } />}
                        </span>
                        <span className={styles.search_bar}>
                            <input type="text" placeholder="Search" onChange={handleSearchChange} />
                            <FaSearch />
                        </span>
                    </div>
                </div >
                <div className={styles.recentadded}>
                    <p>Recent Added Stock Details</p>
                    <div className={styles.filterarea}>
                        <span>
                            <IoFilterSharp />
                            Filter
                        </span>
                    </div>
                </div>

                <div className={styles.AddContainer}>
                    <p className='text-[#000000] font-semibold'>
                        Recent Transactions
                    </p>
                    <div className='flex gap-5'>
                        <button className='rounded-lg text-xs sm:text-base flex items-center gap-1 ' onClick={() => toggleForm()}>
                            <FiPlus />Add Employee</button>
                        <img className='w-6' onClick={() => exportProductsToPDF(bills)} src={pdf} alt="" /><img onClick={() => exportProductsToExcel(bills)} className='w-9' src={excel} alt="" />
                    </div>
                </div>
                <div>
                    {
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tr}>
                                        <th className={styles.th}>S.no</th>
                                        <th className={styles.th}>Date</th>
                                        <th className={styles.th}>Employee Name</th>
                                        <th className={styles.th}>Emp.ID</th>
                                        <th className={styles.th}>Designation</th>
                                        <th className={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        // ACTUAL DATA
                                        currentBills.reverse().map((bill, index) => (
                                            <tr className='relative' key={bill.id}>
                                                <td className={styles.td}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                <td className={styles.td}>{bill?.date?.split('T')[0]}</td>
                                                <td className={styles.td}>{bill?.empName?.toUpperCase()}</td>
                                                <td className={styles.td}>{bill?.empID}</td>
                                                <td className={styles.td}>{bill?.desig}</td>
                                                <td className={styles.td}>
                                                    <div className='flex flex-col sm:flex-row  gap-2 text-xs'>
                                                        <span onClick={() => handleDelete(bill._id)} className='bg-red-200 text-red-500 p-1 rounded-sm px-2'>
                                                            <MdDelete /></span>
                                                        <span className='bg-blue-200 text-blue-500 p-1 rounded-sm px-2' onClick={() => { toggleForm(); setEmployeeData(bill); setEdit(true) }}>
                                                            <MdOutlineModeEdit /></span>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                    }
                    <div className={styles.tablebottom}>
                        <button
                            onClick={() => handleClick("prev")}
                            disabled={currentPage === 1}
                        >
                            <FaLongArrowAltLeft /> Previous
                        </button>
                        <div className={styles.pager}>
                            <div className={styles.pagination}>
                                {(() => {
                                    const totalPages = Math.ceil(bills.length / itemsPerPage);
                                    const pages = [];

                                    if (isMobile) {
                                        // Show only current and one neighbor on mobile
                                        if (currentPage > 1) {
                                            pages.push(
                                                <b
                                                    key={currentPage - 1}
                                                    className=""
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                >
                                                    {currentPage - 1}
                                                </b>
                                            );
                                        }
                                        pages.push(
                                            <b
                                                key={currentPage}
                                                className={styles.active}
                                                onClick={() => setCurrentPage(currentPage)}
                                            >
                                                {currentPage}
                                            </b>
                                        );
                                        if (currentPage < totalPages) {
                                            pages.push(
                                                <b
                                                    key={currentPage + 1}
                                                    className=""
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                >
                                                    {currentPage + 1}
                                                </b>
                                            );
                                        }
                                    } else {
                                        // Full pagination logic for desktop (same as previous logic with ellipsis)
                                        const startPage = Math.max(2, currentPage - 1);
                                        const endPage = Math.min(totalPages - 1, currentPage + 1);
                                        pages.push(
                                            <b
                                                key={1}
                                                className={currentPage === 1 ? styles.active : ""}
                                                onClick={() => setCurrentPage(1)}
                                            >
                                                1
                                            </b>
                                        );
                                        if (startPage > 2) pages.push(<span key="start-ellipsis">...</span>);
                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <b
                                                    key={i}
                                                    className={currentPage === i ? styles.active : ""}
                                                    onClick={() => setCurrentPage(i)}
                                                >
                                                    {i}
                                                </b>
                                            );
                                        }
                                        if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis">...</span>);
                                        if (totalPages > 1) {
                                            pages.push(
                                                <b
                                                    key={totalPages}
                                                    className={currentPage === totalPages ? styles.active : ""}
                                                    onClick={() => setCurrentPage(totalPages)}
                                                >
                                                    {totalPages}
                                                </b>
                                            );
                                        }
                                    }
                                    return pages;
                                })()}
                            </div>
                        </div>
                        <button
                            onClick={() => handleClick("next")}
                            disabled={currentPage === Math.ceil(bills.length / itemsPerPage)}
                        >
                            Next <FaLongArrowAltRight />
                        </button>
                    </div>
                </div>
            </div >

        </div >
    )
}

export default Employee