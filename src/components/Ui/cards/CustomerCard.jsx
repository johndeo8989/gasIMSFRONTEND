import React from "react";
import {
    MdOutlineLocationOn,
    MdOutlineLocalPhone,
    MdMailOutline,
    MdDescription,
} from "react-icons/md";
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import { FaRegAddressCard } from "react-icons/fa6";

const CustomerCard = ({ customer, setCustomerInfo }) => {
    const { toggleInfo } = useFormContext();
    console.log(customer)
    return (
        <div className="w-full min-w-[320px] sm:min-w-[200px] bg-white  max-w-[90%] sm:max-w-md    shadow-sm rounded-xl p-4 sm:p-4 mx-auto">
            <div className="flex flex-row items-center gap-4 mb-2">
                <img
                    src={`http://localhost:8080/uploads/${customer.profilePic}`}
                    alt="Profile"
                    className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
                />
                <div className="text-left flex-1">
                    <h3 className="text-sm sm:text-lg font-semibold">{customer.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center justify-start gap-1">
                        <MdOutlineLocationOn className="text-lg" />
                        {customer.address}
                    </p>
                </div>
            </div>
            <hr className="border-gray-200 my-2 " />
            <div className="text-xs sm:text-sm text-gray-700 space-y-1 md:space-y-3 font-medium ">
                <div className="flex flex-row items-center">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <MdOutlineLocalPhone />
                        Phone:
                    </strong>
                    <p className="text-indigo-800 mt-1 sm:mt-0">{customer.contact}</p>
                </div>
                <div className="flex flex-row items-center">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <MdMailOutline />
                        Email:
                    </strong>
                    <p className="text-indigo-800 mt-1 sm:mt-0 break-all">{customer.email}</p>
                </div>
                <div className="flex flex-row sm:items-center">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <FaRegAddressCard />
                        Card Number:
                    </strong>
                    <p className="text-indigo-800 mt-1 sm:mt-0">{customer.cardNo}</p>
                </div>
                <div className="flex flex-row sm:items-start">
                    <strong className="w-36 text-zinc-400 flex items-center gap-2">
                        <MdDescription />
                        Documents:
                    </strong>
                    <div className="text-indigo-800 mt-1 sm:mt-0 space-y-1">
                        {customer.aadharno}
                    </div>
                </div>
            </div>
            <button
                className="mt-6 text-sm sm:text-base w-full bg-[#D6D6FB] text-[#00006B] py-1 sm:py-2 px-4 rounded hover:bg-[#d0d0ff] transition-colors"
                onClick={() => {
                    setCustomerInfo(customer);
                    toggleInfo();
                }}
            >
                View Details
            </button>
        </div>
    );

};

export default CustomerCard;
