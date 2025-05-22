import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FiPlus } from "react-icons/fi";
import SalesCard from '../../components/Ui/cards/SalesCard';
import Invoice from '../../components/Invoice/Invoice';
import { useFormContext } from '../../context/DisplayForm/FormContext';
import { Link, useNavigate } from 'react-router-dom'

const Sells = () => {
    const navigate = useNavigate()
    const { isFormOpen } = useFormContext();

    // State to store fetched sales data
    const [salesData, setSalesData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const handleSearchChange = (e) => {
        if (e.target.value)
            setSalesData(data.filter((data) => (data.customer_name).toLowerCase().includes(e.target.value.toLowerCase())))
        else {
            setSalesData(data)
        }
    }
    useEffect(() => {
        async function fetchSales() {
            try {
                // Replace the URL below with your actual API endpoint
                const response = await fetch('http://localhost:8080/sales');
                if (!response.ok) {
                    throw new Error('Failed to fetch sales data');
                }
                const data = await response.json();
                setData(data)
                setSalesData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSales();
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(salesData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = salesData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div>
            {isFormOpen &&
                <div className='flex pt-90 2xl:pt-40 justify-center absolute form-container'>
                    <Invoice />
                </div>
            }

            <div className=''>
                <div className='flex-col sm:flex-row mt-8 justify-between flex sm:items-center w-[100%]'>
                    <div className='flex items-center gap-5'>
                        <button
                            className='bg-[#EAEAEA] rounded border border-[#BDBDBD] text-[#808080] p-2 cursor-pointer'
                            onClick={() => navigate('/home')}
                        >
                            <FaArrowLeft />
                        </button>
                        <p className='min-w-[200px] sm:text-lg'>Sales & Customer Details</p>
                    </div>
                    <div className='flex items-center gap-15'>
                        <input
                            type="text"
                            placeholder='Search'
                            className='bg-white mt-3 sm:mt-0 rounded sm:p-2 p-1 sm:px-7'
                            onChange={handleSearchChange}
                        />
                        <Link to={'/sellForm'}>
                            <button className='flex cursor-pointer items-center bg-[#00006B] text-white min-w-[130px] text-xs sm:text-md rounded-md sm:px-7 p-2 justify-center'>
                                <FiPlus />New Sell
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 flex-wrap mt-10'>
                {loading && <p>Loading sales data...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && salesData.length === 0 && <p>No sales data found.</p>}
                {!loading && !error && currentItems.map((sale, index) => (
                    <SalesCard key={index} data={sale} />
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage} of {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default Sells;
