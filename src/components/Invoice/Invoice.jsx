import styles from './styles.module.css'
import logo from '../../assets/kkLogo.png'
import { IoMdCloseCircle } from "react-icons/io";
import { BiSolidFilePdf } from "react-icons/bi";
import { RiPrinterFill } from "react-icons/ri";
import { useFormContext } from '../../context/DisplayForm/FormContext';
import { useState } from 'react';
import { useEffect } from 'react';
const Invoice = () => {
    const { toggleForm, viewData } = useFormContext();

    const [totalAmount, setTotalAmount] = useState(0)

    const calculatetotal = () => {
        const total = viewData.products.map(product => product.quantity * product.unitPrice).reduce((a, b) => a + b, 0)
        setTotalAmount(total)
    }
    useEffect(() => {
        calculatetotal()
    })

    console.log('data', viewData)

    return (
        <div className='py-5 mt-60 sm:mt-8 mb-10 sm:mb-8 min-w-[350px] max-w-[350px] sm:min-w-[750px] sm:max-w-[860px] bg-white'>
            <div className={styles.header}>
                <span className='absolute z-10 text-[#00006b] text-2xl sm:text-4xl -top-4 right-0' onClick={toggleForm}>
                    <IoMdCloseCircle />
                </span>
                <div className={`${styles.left}`}>
                    <img src={logo} alt="" />
                </div>
                <div className={`${styles.right}`}>
                    Tax Invoice
                </div>
                <div className={styles.decor}></div>
            </div>
            <div className={styles.infor}>
                <div className='sm:p-3 p-2 h-full   sm:text-sm'>
                    <div className='sm:flex flex flex-col space-y-2 justify-center'>
                        <div className='flex gap-6'>
                            <span className='min-w-19 '>Invoice To:</span>
                            <span>{viewData.customer_name}</span>
                        </div>

                        <div className='flex gap-6'>
                            <span className='min-w-19 '>Contact:</span>
                            <span>{viewData.customer_contact}</span>
                        </div>
                        <div className='flex gap-6'>
                            <span className='min-w-19 '>GST:</span>
                            <span>Lorem ipsum, dolor</span>
                        </div>
                    </div>

                </div>

                <div className='w-100 items-start  p-3 flex justify-end  h-full'>
                    <div className='flex gap-8 items-center'>
                        <p>Invoice Date</p>
                        <p>11/11/1010</p>
                    </div>
                </div>




            </div>
            {/* TABLE */}
            <div className='px-5 sm:mt-10 mt-6 overflow-auto '>

                <table style={{ border: 'none' }} className={styles.table}>
                    <thead>
                        <tr className={styles.tr}>
                            <th className={styles.th}>S.No</th>
                            <th className={styles.th}>Product Name</th>
                            <th className={styles.th}>HSN Code</th>
                            <th className={styles.th}>Tax</th>
                            <th className={styles.th}>Unit Price</th>
                            <th className={styles.th}>Quantity</th>
                            <th className={styles.th}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewData.products.map(product =>
                            <tr className={styles.tr}>
                                <td className={styles.td}>1</td>
                                <td className={styles.td}>{product.name}</td>
                                <td className={styles.td}>1234</td>
                                <td className={styles.td}>{product.gstPercent}%</td>
                                <td className={styles.td}>₹{product.unitPrice}</td>
                                <td className={styles.td}>{product.quantity}</td>
                                <td className={styles.td}>₹{product.quantity * product.unitPrice}</td>
                            </tr>)}
                    </tbody>
                </table>

            </div>

            <div className={styles.subtotal}>

                <div className='flex flex-col sm:flex-row sm:gap-15'>

                    <div className='flex  flex-col'>
                        <span className={styles.blueDEcor}>Payment Mode</span>
                        <span className='text-[9px] sm:text-[11px]  font-bold text-[#00006b]'>Cash</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className={styles.blueDEcor}>
                            Amount
                        </span>
                        <span className='text-[9px] sm:text-[11px]  font-bold text-[#00006b]'>₹ {totalAmount}</span>
                    </div>


                </div>
                <div className='text-xs w-[180px] flex flex-col gap-2'>

                    <div className='sm:pb-10 flex items-center px-3 justify-between '>
                        <span>Subtotal</span><span>₹ {totalAmount}</span>
                    </div>
                    <hr />
                    <div className='px-3'>
                        <div className=' flex items-center justify-between '>
                            <span>Total Amount</span><span>₹ {totalAmount}</span>
                        </div>
                        <div className=' flex items-center justify-between '>
                            <span>Paid Amount</span><span>₹ {viewData.payment.paid}</span>
                        </div>
                        <div className={styles.blueDEcor}>
                            <span>Due Amount</span><span>₹ {viewData.payment.due}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <p className='sm:text-sm  font-bold mb-3'>Thank You For Your Business</p>
                <hr />
                <div className='flex sm:flex-row flex-col  text-left px-2 sm:text-xs mt-3'>

                    <div className='flex sm:w-[50%] flex-col gap-2 pr-8'>
                        <p className='sm:text-sm font-bold'>Terms and Conditions:</p>
                        <p>For any questions or concerns regarding this invoice or the provided goods/services please contact +91 80062 36800.</p>
                        <p>Orders that are canceled after processing may be subject to a cancellation fee.</p>
                    </div>

                    <div className='sm:w-[50%] flex flex-col gap-2 sm:px-2 sm:text-xs mt-2'>
                        <div className='flex flex-col sm:flex-row'>
                            <span className='min-w-[80px] text-[#5D5D5D]'>Address:</span>
                            <span>Unit No. 214, Tower B, The iThum Tower, Sector 62, Noida Uttar Pradesh 201301</span>
                        </div>
                        <div className='flex flex-col sm:flex-row'>
                            <span className='min-w-[80px] text-[#5D5D5D]'>CIN:</span><span>2222 80062 26800</span>
                        </div>
                        <div className='flex flex-col sm:flex-row'>
                            <span className='min-w-[80px] text-[#5D5D5D]'>GST:</span><span>2222 80062 26800</span>
                        </div>
                        <div className='flex flex-col sm:flex-row'>
                            <span className='min-w-[80px] text-[#5D5D5D]'>Phone No:</span><span>+91 80062 36800</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.btns}>
                <button>
                    <RiPrinterFill />
                    Print Invoice</button>
                <button>
                    <BiSolidFilePdf />
                    Download PDF </button>
            </div>

        </div >
    )
}

export default Invoice