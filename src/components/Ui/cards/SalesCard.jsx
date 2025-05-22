import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useFormContext } from '../../../context/DisplayForm/FormContext';

const SalesCard = ({ data }) => {

    const { isFormOpen, viewData, setViewData, toggleForm } = useFormContext();


    return (
        <div className='flex w-[320px]  shadow-md rounded-lg  m-auto bg-white p-4 text-sm flex-col'>
            <div className='flex items-center mb-3 text-sm justify-between'>
                <p className='text-[#00006B] font-semibold'>Customer Deatils</p>
                <p className='text-xs'>{data?.date.split("T")[0]}</p>
            </div>
            <div className=''>
                <div className='flex items-center  justify-between'>
                    <div className='flex gap-3 items-center justify-center'>
                        <div className='w-12 h-12 bg-red-600 flex items-center overflow-hidden rounded-4xl'>
                            <img src={data?.imageUrl} alt="" />
                        </div>
                        <div>
                            <p>{data?.customer_name}</p>
                            <p className=' text-[#00006B] text-[12px]'>{data?.customer_type}</p>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span>Total Price</span>
                        <span className='text-[#00006B] font-semibold'>₹ {data?.total_amount}</span>
                    </div>
                </div>
                <hr className='my-3 border-[#BDBDBD]' />
                <div>
                    <p className='mb-2'>Product Details</p>
                    <div className='flex  gap-10 items-center justify-between'>
                        <div className=' w-[50%]'>
                            <div className='flex  justify-between'><span>Product</span> : {data?.products.length}</div>
                            <div className='flex  justify-between'><span>Due Amount</span>: {data?.payment?.due}</div>
                        </div>
                        <div className=' w-[50%]'>
                            <div className='flex  justify-between'><span>Invoice no</span>: {data?.invoice_number}</div>
                            <div className='flex  justify-between'><span>Paid Amount</span>: {data?.payment?.paid}</div>
                        </div>
                    </div>
                </div>
                <hr className='my-4 border-[#BDBDBD]' />
                <div className='flex font-bold gap-10 items-center justify-center'>
                    <Link className='w-[50%]' to='/sellHistory'>
                        <button className='bg-[#D6D6FB] text-[#00006B] w-[100%] p-2 px-4 rounded-md' onClick={() => setViewData(data)}>View Details</button>
                    </Link>
                    <button className='bg-gray-200 text-[#00006B] w-[50%]  p-2 px-4 rounded-md' onClick={() => { setViewData(data); toggleForm() }}>
                        View Invoice
                    </button>
                </div>
            </div>
        </div >
    )
}

export default SalesCard