import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import styles from './layout.module.css'
import ExpenseCategory from '../../Ui/ExpenseCategory/ExpenseCategory';
import pdf from '../../../pages/Expense/pdf.png'
import excel from '../../../pages/Expense/excel.png'
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { IoFilterSharp } from 'react-icons/io5';
import { CgMenuGridR } from 'react-icons/cg';
import { FiPlus } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
const ExpenseLayout = ({ children, data, fetchData, title, handleSearchChange }) => {

    const { toggleForm, setViewData } = useFormContext();

    const [categoryVisible, setCategoryVisible] = useState(false)

    const [date, setDate] = useState('')

    const onDateChange = (e) => {
        setDate(e.target.value)
        setViewData(data.filter(bill => bill.date.split('T')[0] === e.target.value))
    }

    const [showShort, setShowShort] = useState(false)

    const toggleSort = () => {
        setShowShort(!showShort);
    }

    const onSortChange = (order) => {
        if (order === 'desc')
            setViewData([...data].sort(function (a, b) { return b.expensePrice - a.expensePrice }))
        else if (order === 'asc') setViewData([...data].sort(function (a, b) { return a.expensePrice - b.expensePrice }))
    }

    const cols = {
        "salary": ["S.No", "Date", "Name", "Designation", "Salary", 'Narration', 'Expense Type'],
        'transportation': ["S.No", "Date", "Total Person", "Total Expense", 'Narration', 'Expense Type'],
        'maintenance': ["S.No", "Date", "Work", "Total Expense", 'Narration', 'Expense Type'],
        'rent': ["S.No", "Date", "Rent Name", "Total Expense", 'Narration', 'Expense Type'],
        'marketing': ["S.No", "Date", "Work", "Total Expense", 'Narration', 'Expense Type'],
        'stationary': ["S.No", "Date", "Items", "Total Expense", 'Narration', 'Expense Type'],
        'utility': ["S.No", "Date", "Bill Name", 'Bill No', "Total Expense", 'Narration', 'Expense Type'],
        'patty': ["S.No", "Date", "Bill Name", 'Bill No', "Total Expense", 'Narration', 'Expense Type'],
    }



    const exportProductsToPDF = (bills) => {
        const doc = new jsPDF();
        const tableColumn = cols[title.toLowerCase()];
        const tableRows = [];
        bills.forEach((bill, index) => {
            const rowData = {
                'salary': [index + 1, bill.date?.split('T')[0], bill.name, bill.additionalInfo?.designation, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'transportation': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.totalPerson, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'maintenance': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.work, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'rent': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.rentName, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'marketing': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.work, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'stationary': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.item, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'utility': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.billName, bill.additionalInfo?.billNo, bill.expensePrice, bill.shortNarration, bill.expenseType],
                'patty': [index + 1, bill.date?.split('T')[0], bill.additionalInfo?.billName, bill.additionalInfo?.billNo, bill.expensePrice, bill.shortNarration, bill.expenseType],
            }
            tableRows.push(rowData[title.toLowerCase()]);
        });
        console.log(tableRows)
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
        const tableRows = []
        bills.forEach((bill, index) => {
            const rowData =
            {
                'salary': { "S.No": index + 1, 'Date': bill.date?.split('T')[0], 'Name': bill.name, "Designation": bill.additionalInfo?.designation, 'Salary': bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType },
                'transportation': {
                    "S.No": index + 1, 'Date': bill.date?.split('T')[0], "Total Person": bill.additionalInfo?.totalPerson, "Total Expense": bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType
                },
                'maintenance': { "S.No": index + 1, 'Date': bill.date?.split('T')[0], 'Work': bill.additionalInfo?.work, "Total Expense": bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType },
                'rent': {
                    "S.No": index + 1, "Date": bill.date?.split('T')[0], "Rent Name": bill.additionalInfo?.rentName, "Total Expense": bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType
                },
                'marketing': {
                    "S.No": index + 1, 'Date': bill.date?.split('T')[0], 'Work': bill.additionalInfo?.work, "Total Expense": bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType
                },
                'stationary': {
                    "S.No": index + 1, "Date": bill.date?.split('T')[0], "Items": bill.additionalInfo?.item, "Total Expense": bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType
                },
                'utility': {
                    "S.No": index + 1, 'Date': bill.date?.split('T')[0], "Bill Name": bill.additionalInfo?.billName, 'Bill No': bill.additionalInfo?.billNo, "Total Expense": bill.expensePrice, 'Narration': bill.shortNarration, 'Expense Type': bill.expenseType
                },
            }
            tableRows.push(rowData[title.toLowerCase()]);
        });
        const worksheet = XLSX.utils.json_to_sheet(tableRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

        XLSX.writeFile(workbook, "expense.xlsx");
    };





    return (
        <div className='block sm:flex relative mt-4'>
            <div className='layout pr-0 sm:pr-5 flex-1'>
                <div className={styles.overviewcontainer}>
                    <div className={styles.right}>
                        <div className='flex sm:gap-3 items-center'>
                            <button>
                                <FaArrowLeft />
                            </button>
                            <p className='text-xs'>{title}</p>
                        </div>
                        <span className='block lg:hidden text-[#00006b]' onClick={() => setCategoryVisible(true)}><CgMenuGridR /></span>
                    </div>

                    <div className={styles.left}>
                        <span className='flex items-center gap-2'>
                            <input type="date" value={date} onChange={onDateChange} className={styles.date} />
                            {date && <RxCross2 onClick={() => { fetchData(); setDate('') }
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
                                    <RxCross2 onClick={() => setViewData([...data].reverse())
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
                <div className={styles.AddContainer}>
                    <p className='text-[#000000] font-semibold'>
                        Recent Transactions
                    </p>
                    <div className='flex gap-5'>
                        <button className='rounded-sm text-xs sm:text-base flex items-center gap-1 ' onClick={() => toggleForm()}>
                            <FiPlus />Add Expense</button>
                        <img className='w-6' onClick={() => exportProductsToPDF(data)} src={pdf} alt="" /><img onClick={() => exportProductsToExcel(data)} className='w-9' src={excel} alt="" />
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
            <div className='hidden lg:block'>
                <ExpenseCategory />
            </div>

            {categoryVisible &&
                <div className='absolute top-0 right-0'>
                    <ExpenseCategory setCategoryVisible={setCategoryVisible} />
                </div>}</div>
    )
}

export default ExpenseLayout