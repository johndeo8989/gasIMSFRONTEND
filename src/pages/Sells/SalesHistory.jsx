import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { useFormContext } from '../../context/DisplayForm/FormContext';

const SalesHistory = () => {
    const navigate = useNavigate()
    const { viewData } = useFormContext();
    return (
        <div>
            <div className=''>
                <div className='flex-col sm:flex-row  mt-8 justify-between flex sm:items-center w-[100%]'>
                    <div className='flex items-center gap-5'>
                        <button className='bg-[#EAEAEA] rounded border border-[#BDBDBD] text-[#808080] p-2 cursor-pointer' onClick={() => navigate('/sell')}>
                            <FaArrowLeft />
                        </button>
                        <p className='sm:text-lg'>{'Sales & Customer Details'}
                        </p>
                    </div>
                    <div className='flex   mt-3 sm:mt-0 justify-between items-center gap-15'>
                        <input type="text" placeholder='Search' className='bg-white rounded sm:p-2 p-1 sm:px-7' />
                        <button className='flex items-center bg-[#00006B] text-white sm:text-xl rounded-md p-2  justify-center'>
                            <IoMdDownload />
                        </button>
                    </div>
                </div>
                <div className='bg-[#EBEBFF] flex-col sm:flex-row gap-3  sm:items-center text-md mt-5 sm:mt-10 rounded-xl flex p-4 sm:p-5 sm:py-7 sm:justify-between'>
                    <div className='flex sm:flex-col justify-between text-xs sm:gap-4 '>
                        <p className='text-[#00006B] font-bold'>{viewData.customer_name}</p>
                        <p>{viewData.date.split('T')[0]}</p>
                    </div>
                    <div className='flex text-[10px] flex-col sm:flex-row gap-3 sm:gap-7 sm:text-sm'>
                        <div className='flex flex-col gap-1 sm:gap-4 '>
                            <div className='flex items-center justify-between'>
                                <p className='text-[#5B5B5B] w-25 lg:w-35'>Vehicle no. :</p>
                                <p className='font-bold'>DL526SF01</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='text-[#5B5B5B] w-25 lg:w-35'>Deliver date :</p>
                                <p className='font-bold'>12 jan, 2022</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1 sm:gap-4 '>
                            <div className='flex items-center justify-between'>
                                <p className='text-[#5B5B5B] w-25 lg:w-35'>Total Products :</p>
                                <p className='font-bold'>{viewData.products.length}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='text-[#5B5B5B] w-25 lg:w-35'>Due Amount :</p>
                                <p className='font-bold'>{viewData.payment.due}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1 sm:gap-4 '>
                            <div className='flex items-center justify-between'>
                                <p className='text-[#5B5B5B] w-25 lg:w-35'>Total Price :</p>
                                <p className='font-bold'>{viewData.total_amount}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='text-[#5B5B5B] w-25 lg:w-35'>Due date :</p>
                                <p className='font-bold'>{viewData.payment.date.split('T')[0]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 pb-5'>
                {
                    viewData.products.map((product, index) => (
                        <Card key={index} data={product} index={index} />
                    ))
                }
            </div>
        </div>
    )
}
const Card = ({ data, index }) => {
    return (
        <div className='flex flex-col 2xl:flex-row w-[350px]  lg:w-[730px] text-md items-start sm:items-center justify-between sm:p-7 p-3 lg:px-9 mt-10 rounded-2xl relative  m-auto  border-[#D0D0D0] bg-white border'>

            <div className='lg:w-[25%] w-[100%]  flex lg:flex-col  lg:justify-end items-center'>
                <span className='absolute w-[25px] h-[25px] flex items-center justify-center rounded-4xl font-bold border
                 border-[#00006B] text-[#00006B] bg-[#EBEBFF] left-2 top-2'>{index + 1}</span>
                <div className='w-[50px] border-5 border-[#F1F1F1]  flex sm:items-center justify-center rounded-4xl overflow-hidden h-[50px]'>
                    <img src="https://media.giphy.com/media/hB6ra7PQpQfNS/giphy.gif" alt="" />
                </div>
                <div className='text-center'>
                    <p className='text-lg text-[#323232] font-semibold'>{data.name}</p>
                    <p className='text-xs '>{data.category}</p>
                </div>
            </div>

            <div className='flex text-xs mt-2 lg:mt-4 gap-3 lg:text-md lg:gap-12'>
                <div className='flex  flex-col lg:gap-4'>
                    <div className='flex items-start flex-col sm:flex-row sm:items-center justify-between'>
                        <p className='text-[#5B5B5B] w-25 lg:w-35'>No. of units : </p>
                        <p className='font-bold'>{data.quantity}</p>
                    </div>
                    <div className='flex items-start flex-col sm:flex-row sm:items-center justify-between'>
                        <p className='text-[#5B5B5B] w-25 lg:w-35'>Tax Percentage :</p>
                        <p className='font-bold'>{data.gstPercent}%</p>
                    </div>
                    <div className='flex items-start flex-col sm:flex-row sm:items-center justify-between'>
                        <p className='text-[#5B5B5B] w-25 lg:w-35'>Total Price :</p>
                        <p className='font-bold'>{data.quantity * data.unitPrice}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='flex items-start flex-col sm:flex-row sm:items-center justify-between'>
                        <p className='text-[#5B5B5B] w-25 lg:w-35'>Unit per price :</p>
                        <p className='font-bold'>{data.unitPrice}</p>
                    </div>
                    <div className='flex items-start flex-col sm:flex-row sm:items-center justify-between'>
                        <p className='text-[#5B5B5B] w-25 lg:w-35'>Invoice no :</p>
                        <p className='font-bold'>DGDG255</p>
                    </div>
                </div>
            </div>
        </div>)
}
export default SalesHistory