import { MdDeleteOutline } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import styles from './expense.module.css'
import { IoEyeOutline } from "react-icons/io5";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { useFormContext } from "../../context/DisplayForm/FormContext";
import ExpenseLayout from "../../components/layout/ExpenseLayout/ExpenseLayout";
import MarketingForm from "../../components/Ui/form/Expense/MarketingForm";
import axios from "axios";
import UpdateExpense from "../../components/Ui/form/Expense/UpdateExpense";
import { handleError } from "../../utils/utils";

const Marketing = () => {
    const [data, setData] = useState([])
    const { isFormOpen, viewData, setViewData } = useFormContext();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/expenses/marketing');
            setViewData([...response.data.expenses].reverse()); setData([...response.data.expenses].reverse())
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [isMobile, setIsMobile] = useState(false);


    const [initialData, setInitialData] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 480); // adjust the width as needed
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const handleSearchChange = (e) => {
        if (e.target.value) {
            setViewData(
                [...viewData].reverse().filter((data) =>
                    (data.date?.toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.expensePrice?.toString().toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.expenseType?.toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.longNarration?.toLowerCase().includes(e.target.value.toLowerCase())) ||  // Fixed: added optional chaining
                    (data.shortNarration?.toLowerCase().includes(e.target.value.toLowerCase()))
                )
            );
        } else {
            setViewData([...data].reverse());
        }
    }
    const handleClick = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (
            direction === "next" &&
            currentPage < Math.ceil(viewData.length / itemsPerPage)
        ) {
            setCurrentPage(currentPage + 1);
        }
    };
    const [id, setId] = useState('')
    const [opt, setOpt] = useState(false)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentviewData = viewData.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <div className='block sm:flex relative '>
            {isFormOpen &&
                <div className={`absolute form-container bg-red-300 w-full h-screen`}>
                    {isEdit ? <UpdateExpense setIsEdit={setIsEdit} type={'Marketing'} initialData={initialData} fetchData={fetchData} /> : <MarketingForm fetchData={fetchData} />}
                </div>
            }
            <div className='sm:flex-1'>
                <ExpenseLayout data={data} fetchData={fetchData} handleSearchChange={handleSearchChange} title={'Marketing'}>
                    <div >
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tr}>
                                        <th className={styles.th}>S.no</th>
                                        <th className={styles.th}>Date</th>
                                        <th className={styles.th}>Work</th>
                                        <th className={styles.th}>Expense</th>
                                        <th className={styles.th}>Narration</th>
                                        <th className={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentviewData.map((bill, index) => (
                                        <tr className={styles.tr} key={bill.id}>
                                            <td className={styles.td}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                            <td className={styles.td}>{bill?.date?.split('T')[0]}</td>
                                            <td className={styles.td}>{bill.additionalInfo?.work}</td>
                                            <td className={styles.td}>₹{bill.expensePrice}</td>
                                            <td className={styles.td}>{bill.shortNarration}</td>
                                            <td className={styles.td}>
                                                <b onClick={() => {
                                                    setId(bill._id);
                                                    if (bill._id === id)
                                                        setOpt(!opt)
                                                }}>...</b>
                                                {bill._id === id && opt && <ActionButtons setInitialData={setInitialData} setIsEdit={setIsEdit} data={bill} id={id} fetchData={fetchData} />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                        const totalPages = Math.ceil(viewData.length / itemsPerPage);
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
                                disabled={currentPage === Math.ceil(viewData.length / itemsPerPage)}
                            >
                                Next <FaLongArrowAltRight />
                            </button>
                        </div>
                    </div>
                </ExpenseLayout>
            </div >

        </div >
    )
}

const ActionButtons = ({ id, fetchData, data, setInitialData, setIsEdit }) => {
    const { toggleForm } = useFormContext();

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/expenses/${id}`);
            handleError('Expense deleted:');
            console.log(response)
            fetchData()
            // You can add code here to update the UI or state after deletion
        } catch (error) {
            console.error('Error deleting expense:', error.message);
            // Handle the error appropriately, like showing a message to the user
        }
    };

    return (
        <div className='absolute z-1'>
            <button onClick={() => { toggleForm(); setIsEdit(true); setInitialData(data) }} style={buttonStyle}>
                <span style={iconStyle}><FaRegEdit />
                </span> Edit
            </button>
            <button style={buttonStyle}>
                <IoEyeOutline />
                <span style={iconStyle}></span> View
            </button>
            <button style={{ ...buttonStyle, color: 'red' }} onClick={() => handleDelete(id)}>
                <span style={{ ...iconStyle, color: 'red' }}>
                    <MdDeleteOutline /></span> Delete
            </button>
        </div>
    );
};
const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    border: '1px solid #eee',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    marginBottom: '5px',
    width: '100%',
    textAlign: 'left',
    fontSize: '12px',
    cursor: 'pointer',
};

const iconStyle = {
    marginRight: '10px',
    fontSize: '16px',
};


export default Marketing