import React from 'react';
import excel from './excel.png'
import pdf from './pdf.png'
import SearchBar from '../../Ui/SearchBar/SearchBar';
import { exportToExcel } from '../../../utils/exportToExcel';
import { useFormContext } from '../../../context/DisplayForm/FormContext';
import { exportToPDF } from '../../../utils/exportToPDF'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineAdd } from "react-icons/md";

const ExportAndCounter = ({ data }) => {
    const { toggleForm } = useFormContext()
    const location = useLocation().pathname.slice(1).slice(1)
    const handleExportPDF = () => {
        exportToPDF(data, 'Suppliers_data');
        alert('not')
    };
    console.log(location, 'locatikon')
    const handleExportSheet = () => {
        const formattedData = data.map(s => ({
            Name: s.name,
            Email: s.email,
            Contact: s.contact,
            Address: s.address,
            GST: s.gstno
        }))
        exportToExcel(formattedData, 'Suppliers_data')
    }
    const navigate = useNavigate()
    console.log(location, '---')
    return (
        <div className="flex items-center justify-between mt-5 sm:mt-1 lg:mt-3 gap-2 lg:mb-2 ">
            <div className="mr-5 text-sm md:text-lg min-w-[90px]">
                <p>{useLocation().pathname.slice(1)[0].toUpperCase() + location}: {data.length}</p>
            </div>
            <div className='flex gap-2  items-center'>
                <button
                    onClick={handleExportSheet}
                    className="mr-2"
                >
                    <img src={excel} alt="" className='w-[28px] sm:w-7 min-w-4 ' />
                </button>
                <button
                    onClick={handleExportPDF}
                    className=" mr-2"
                >
                    <img src={pdf} alt="" className='w-5 sm:w-7 min-w-4' />
                </button>
                <button onClick={() => { location === 'ustomer' ? navigate('/addcustomer') : toggleForm() }} className="add-supplier-btn w-[75px] sm:min-w-[120px] py-[6px] text-xs px-1 sm:text-sm md:text-md bg-[#00006B] text-white md:py-2 md:px-4 rounded hover:bg-[#00006B] flex items-center gap-1">
                    <MdOutlineAdd className='text-[16px]' />
                    {useLocation().pathname.slice(1)[0].toUpperCase() + location}
                </button>
            </div>
        </div>
    );
};
const PageLayout = ({ children, data }) => {
    return (
        <div className="min-h-screen">
            <header className="mb-5 mt-3 sm:mt-0 sm:p-5 border-b border-gray-300 pb-2">
                <SearchBar data={data} />
                <ExportAndCounter data={data} />
            </header>
            <main >{children}</main>
        </div>
    );
};

export default PageLayout;