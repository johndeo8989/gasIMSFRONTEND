import { useEffect, useState } from 'react'
import { FaArrowLeft, FaRegEdit, FaSearch } from 'react-icons/fa'
import styles from './expense.module.css'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { IoEyeOutline, IoFilterSharp } from 'react-icons/io5'
import { MdDeleteOutline, MdOutlineShoppingCart } from 'react-icons/md'
import { RiBillFill } from 'react-icons/ri'
import { GiReceiveMoney } from "react-icons/gi";
import { PiCubeTransparent } from "react-icons/pi";
import pdf from './pdf.png'
import excel from './excel.png'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import ExpenseCategory from '../../components/Ui/ExpenseCategory/ExpenseCategory'
import { useFormContext } from "../../context/DisplayForm/FormContext";
import ExpenseForm from '../../components/Ui/form/Expense/ExpenseForm'
import { fetchExpense } from "../../redux/slices/expenseSlice";
import { CgMenuGridR } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux'
import { FiPlus } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { RxCross2 } from "react-icons/rx";
import * as XLSX from "xlsx";
import axios from 'axios'
import { handleError } from '../../utils/utils'
const ExpenseOverview = () => {
    const { isFormOpen, toggleForm } = useFormContext();
    const dispatch = useDispatch();
    const { expense, loading } = useSelector(state => state.expense)
    const [bills, setBills] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [categoryVisible, setCategoryVisible] = useState(false)
    useEffect(() => {
        dispatch(fetchExpense())
    }, [dispatch])
    useEffect(() => {
        setBills([...expense].reverse())
    }, [expense])
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
    const handleSearchChange = (e) => {
        if (e.target.value) {
            setBills(
                [...expense].reverse().filter((data) =>
                    (data.date?.toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.expensePrice?.toString().toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.expenseType?.toLowerCase().includes(e.target.value.toLowerCase())) ||
                    (data.longNarration?.toLowerCase().includes(e.target.value.toLowerCase())) ||  // Fixed: added optional chaining
                    (data.shortNarration?.toLowerCase().includes(e.target.value.toLowerCase()))
                )
            );
        } else {
            setBills([...expense].reverse());
        }
    }
    const [showShort, setShowShort] = useState(false)

    const toggleSort = () => {
        setShowShort(!showShort);
    }

    const onSortChange = (order) => {
        if (order === 'desc')
            setBills([...expense].sort(function (a, b) { return b.expensePrice - a.expensePrice }))
        else if (order === 'asc') setBills([...expense].sort(function (a, b) { return a.expensePrice - b.expensePrice }))
    }

    const [totalExpense, setTotalExpense] = useState(0)

    const [totalSalary, setTotalSalary] = useState(0)

    const [totalBills, setTotalBills] = useState(0)

    const [totalRent, setTotalRent] = useState(0)

    const calculateSum = (arr) => {
        return arr.reduce((total, current) => {
            return total + current;
        }, 0);
    }

    useEffect(() => {
        setTotalExpense(calculateSum(expense.map(exp => exp.expensePrice)))
        setTotalSalary(calculateSum(expense.filter(exp => exp.expenseType === 'salary').map(salary => salary.expensePrice)))
        setTotalBills(calculateSum(expense.filter(exp => exp.expenseType === 'utility').map(bills => bills.expensePrice)))
        setTotalRent(calculateSum(expense.filter(exp => exp.expenseType === 'rent').map(rent => rent.expensePrice)))
    }, [expense])
    let formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const formattedNumber = (number) => {
        return formatter.format(number);
    }
    const [date, setDate] = useState('')
    const onDateChange = (e) => {
        setDate(e.target.value)
        setBills(expense.filter(bill => bill.date.split('T')[0] === e.target.value))
    }
    const [id, setId] = useState('')
    const [opt, setOpt] = useState(false)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBills = bills.slice(indexOfFirstItem, indexOfLastItem);
    console.log("bills:", bills);
    const exportProductsToPDF = (bills) => {
        const doc = new jsPDF();
        const tableColumn = ["S.No", "Date", "Expense Type", "Sht. Nara", "Long. Nara", "Expense"];
        const tableRows = [];
        bills.forEach((bill, index) => {
            const rowData = [
                index + 1,
                bill.date?.split('T')[0],
                bill.expenseType,
                bill.shortNarration,
                bill.longNarration,
                bill.expensePrice,
            ];
            tableRows.push(rowData);
        });
        doc.text("Total Expenses", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 }

        });
        doc.save("expense.pdf");
    };
    const exportProductsToExcel = (bills) => {
        const data = bills.map((bill, index) => ({
            "S.No": index + 1,
            "Date": bill.date?.split('T')[0],
            "Expense Type": bill.expenseType,
            "Sht. Nara": bill.shortNarration,
            "Long. Nara": bill.longNarration,
            "Expense": bill.expensePrice
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        XLSX.writeFile(workbook, "expense.xlsx");
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
    return (
        <div className='block sm:flex relative mt-4'>
            {isFormOpen &&
                <div className={`absolute form-container bg-red-300 w-full h-screen`}>
                    <ExpenseForm />
                </div>
            }
            <div className='lg:pr-5 flex-1'>
                <div className={styles.overviewcontainer}>
                    <div className={styles.right}>
                        <div className='flex gap-3 items-center'>
                            <button>
                                <FaArrowLeft />
                            </button>
                            <p>Overview</p>
                        </div>
                        <span className='block lg:hidden  text-[#00006b]' onClick={() => setCategoryVisible(true)}><CgMenuGridR /></span>
                    </div>
                    <div className={styles.left}>
                        <span className='flex items-center gap-2'>
                            <input type="date" value={date} onChange={onDateChange} className={styles.date} />
                            {date && <RxCross2 onClick={() => { setBills([...expense].reverse()); setDate('') }
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
                        <div className='relative '>
                            <span onClick={toggleSort}>
                                {!showShort ?
                                    < FaArrowRightArrowLeft style={{ rotate: '90deg' }} /> :
                                    <RxCross2 onClick={() => setBills([...expense].reverse())
                                    } />}

                                Sort
                            </span>
                            {showShort &&
                                <div className="border-1 absolute border-zinc-300 bg-white rounded-md w-[100px] p-1">
                                    <div
                                        className="bg-zinc-200 p-1 text-sm text-center rounded cursor-pointer"
                                        onClick={() => onSortChange("asc")}
                                    >
                                        ↑ Accending
                                    </div>
                                    <div
                                        className="bg-zinc-200 mt-1 p-1 text-sm rounded text-center cursor-pointer"
                                        onClick={() => onSortChange("desc")}
                                    >
                                        ↓ Decending
                                    </div>
                                </div>
                            }
                        </div>
                        <span>
                            <IoFilterSharp />
                            Filter
                        </span>
                    </div>
                </div>
                <div className={styles.card_container}>
                    <div>
                        <b>₹ <span className='tracking-wider'>{formattedNumber(totalExpense)}</span></b>
                        <p>
                            <span>
                                <MdOutlineShoppingCart />
                            </span>{" "}
                            Total Expense
                        </p>
                    </div>
                    <div>
                        <b>₹ <span className='tracking-wider'>{formattedNumber(totalSalary)}</span></b>
                        <p>
                            <span>
                                <GiReceiveMoney />
                            </span>
                            Salary
                            <i>30%</i>
                        </p>
                    </div>{" "}
                    <div>
                        <b>₹ <span className='tracking-wider'>{formattedNumber(totalBills)}</span></b>
                        <p>
                            <span>
                                <RiBillFill />
                            </span>
                            Bills
                            <i>60%</i>
                        </p>
                    </div>{" "}
                    <div>
                        <b>₹ <span className='tracking-wider'>{formattedNumber(totalRent)}</span></b>
                        <p>
                            <span>
                                {" "}
                                <PiCubeTransparent />
                            </span>
                            Rent
                            <i>10%</i>
                        </p>
                    </div>
                </div>
                <div className={styles.AddContainer}>
                    <p className='text-[#000000] font-semibold'>
                        Recent Transactions
                    </p>
                    <div className='flex gap-5'>
                        <button className='rounded-lg text-xs sm:text-base flex items-center gap-1 ' onClick={() => toggleForm()}>
                            <FiPlus />Add Expense</button>
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
                                        <th className={styles.th}>Expense Type</th>
                                        <th className={styles.th}>Sht. Nara</th>
                                        <th className={styles.th}>Expense</th>
                                        <th className={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        // SKELETON LOADING
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <tr className={styles.tr} key={index}>
                                                <td className={styles.td}><div className="skeleton skeleton-text"></div></td>
                                                <td className={styles.td}><div className="skeleton skeleton-text"></div></td>
                                                <td className={styles.td}><div className="skeleton skeleton-text"></div></td>
                                                <td className={styles.td}><div className="skeleton skeleton-text"></div></td>
                                                <td className={styles.td}><div className="skeleton skeleton-text"></div></td>
                                                <td className={styles.td}><div className="skeleton skeleton-text"></div></td>
                                                <td className={styles.td}><div className="skeleton skeleton-button"></div></td>
                                            </tr>
                                        ))
                                    ) : (
                                        // ACTUAL DATA
                                        currentBills.map((bill, index) => (
                                            <tr className='relative' key={bill.id}>
                                                <td className={styles.td}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                <td className={styles.td}>{bill?.date?.split('T')[0]}</td>
                                                <td className={styles.td}>{bill?.expenseType?.toUpperCase()}</td>
                                                <td className={styles.td}>{bill?.shortNarration}</td>
                                                <td className={styles.td}>₹{bill?.expensePrice}</td>
                                                <td className={styles.td}>                                                    <b onClick={() => {
                                                    setId(bill._id);
                                                    if (bill._id === id)
                                                        setOpt(!opt)
                                                }}>...</b>
                                                    {bill._id === id && opt && <ActionButtons id={id} />}
                                                </td>                                            </tr>
                                        ))
                                    )}
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
            <div className='hidden lg:block'>
                <ExpenseCategory />
            </div>
            {categoryVisible &&
                <div className='absolute top-0 right-0'>
                    <ExpenseCategory setCategoryVisible={setCategoryVisible} />
                </div>}
        </div >
    )
}
const ActionButtons = ({ id }) => {
    const dispatch = useDispatch();
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/expenses/${id}`);
            handleError('Expense deleted:');
            console.log(response)
            dispatch(fetchExpense())
        } catch (error) {
            console.error('Error deleting expense:', error.message);
        }
    };
    return (
        <div className='absolute z-1'>
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


export default ExpenseOverview