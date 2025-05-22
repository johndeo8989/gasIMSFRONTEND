import React from "react";
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { handleError } from "../../../utils/utils";
import { fetchConsumer } from "../../../redux/slices/customerSlice";
import { Navigate, useNavigate } from "react-router-dom";
import UpdateConsumerForm from "../form/UpdateConsumerForm";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";



const CustomerInfoCard = ({ data }) => {
    const { toggleInfo, setViewData } = useFormContext();
    const dispatch = useDispatch();
    const { consumer } = useSelector(state => state.consumer);
    const id = data._id;


    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:8080/delete/consumer/${id}`);
            handleError("Customer deleted successfully!");
            dispatch(fetchConsumer());
            setViewData(consumer);
            toggleInfo();
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Failed to delete customer. Please try again.");
        }
    };

    const navigate = useNavigate()

    return (
        <div className="w-[90%] md:max-w-md  md:min-w-md p-6 bg-white rounded-xl shadow-md relative text-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-[#00006B] font-semibold">Customer Info</h2>
                <button onClick={toggleInfo} className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm">
                    Close
                </button>
            </div>
            <div className="flex items-center mb-6">
                <label htmlFor="profilePic" className="relative cursor-pointer">
                    <img src={`http://localhost:8080/uploads/${data.profilePic}`} className="w-16 h-16 rounded-full object-cover" />
                </label>
            </div>
            <div className="grid grid-cols-2 text-xs sm:text-sm gap-4 text-gray-800 mb-6">
                {[
                    { label: "Customer Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Phone No.", name: "contact", type: "text" },
                    { label: "Card No.", name: "cardNo", type: "text" },
                    { label: "Aadhar No.", name: "aadharno", type: "text" },
                    { label: "Address", name: "address", type: "text" }
                ].map((field, idx) => (
                    <div key={idx} className="overflow-hidden">
                        <label className="block text-gray-500">{field.label}</label>
                        <p>{data[field.name]}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">

                <button onClick={handleDelete} className="bg-red-100 flex items-center text-red-700 px-3 py-1 rounded-md text-sm">
                    <MdDelete />
                    <span className="ml-1">Delete</span>
                </button>

                <button
                    className="bg-violet-100 flex items-center text-violet-700 px-3 py-1 rounded-md text-sm"
                    onClick={() => {
                        navigate(`/updatecustomer/${id}`)
                    }}
                >
                    <MdModeEdit />
                    Edit
                </button>
            </div>
        </div>
    );
};

export default CustomerInfoCard;
