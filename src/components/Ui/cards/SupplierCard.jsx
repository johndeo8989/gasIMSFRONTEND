import React from "react";
import { MdOutlineLocationOn, MdOutlineLocalPhone, MdMailOutline } from "react-icons/md";
import gstIcon from './vector.svg'
import { useFormContext } from "../../../context/DisplayForm/FormContext";

const SupplierCard = ({
    supplier, setSupplierInfo
}) => {

    const { toggleInfo } = useFormContext()

    return (
        <div className="w-full min-w-[220px] max-w-[90%] sm:max-w-md md:max-w-lg   shadow-sm rounded-xl bg-white p-4  mx-auto">
            <div className="flex flex-row sm:items-center gap-4 mb-4">
                <img
                    src={supplier.profilePic ? `http://localhost:8080/uploads/${supplier.profilePic}` : `https://i.pinimg.com/originals/a0/60/be/a060be70906ff02fea00add1144e4ad7.jpg`}
                    alt="Profile"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
                />
                <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold">{supplier.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center justify-start gap-1">
                        <MdOutlineLocationOn className="text-lg" />
                        {supplier.address}
                    </p>
                </div>
            </div>

            <hr className="border-gray-200 my-4" />

            <div className="text-sm  text-gray-700 sm:space-y-4 font-medium">
                <div className="flex flex-row sm:items-center">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <MdOutlineLocalPhone />
                        Phone:
                    </strong>
                    <p className="text-indigo-800 flex-1  mt-1 sm:mt-0">{supplier.contact}</p>
                </div>
                <div className="flex flex-row sm:items-center">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <MdMailOutline />
                        Email:
                    </strong>
                    <p className="text-indigo-800 flex-1   mt-1 sm:mt-0 break-all">{supplier.email}</p>
                </div>
                <div className="flex flex-row sm:items-center">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <img src={gstIcon} alt="GST" className="w-4 h-4" />
                        GST Number:
                    </strong>
                    <p className="text-indigo-800 flex-1  mt-1 sm:mt-0">{supplier.gstno}</p>
                </div>
            </div>

            <button
                className="mt-6 w-full bg-[#D6D6FB] text-[#00006B] py-2 px-4 rounded-sm hover:bg-[#D6D6FB] transition-colors"
                onClick={() => {
                    setSupplierInfo(supplier)
                    toggleInfo()
                }}
            >
                View Details
            </button>
        </div>


    );
};

export default SupplierCard;