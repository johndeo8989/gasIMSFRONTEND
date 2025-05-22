import React, { useState } from 'react';
import { useFormContext } from '../../../context/DisplayForm/FormContext';
import axios from 'axios';
import { fetchSuppliers } from '../../../redux/slices/SupplierSlice';
import { useDispatch, useSelector } from 'react-redux';
import { handleSuccess, handleError } from '../../../utils/utils'
import { MdDelete } from "react-icons/md";

import { MdModeEditOutline } from "react-icons/md";
import { RiPencilLine } from 'react-icons/ri';

const InforCard = ({ data }) => {
    const { toggleInfo } = useFormContext();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedSupplier, setUpdatedSupplier] = useState({
        name: data.name,
        email: data.email,
        contact: data.contact,
        gstno: data.gstno,
        address: data.address,
        profilePic: data.profilePic
    });
    const { setViewData } = useFormContext()
    const dispatch = useDispatch();
    const { supplier } = useSelector(state => state.supplier)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedSupplier((prev) => ({ ...prev, [name]: value }));
    };
    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };
    console.log('object', updatedSupplier)
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }
        setUpdatedSupplier((prev) => ({ ...prev, profilePic: file }));
    };


    const id = data._id;
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        if (!confirmDelete) return;
        try {
            const response = await axios.delete(`http://localhost:8080/supplier/delete/${id}`);
            console.log("Deleted supplier:", response.data);
            handleError("Supplier deleted successfully!");
            // Optional: Clear selected supplier or refresh list
            dispatch(fetchSuppliers())
            setViewData(supplier)
            // If you have a function to reload data
            toggleInfo()
        } catch (error) {
            console.error("Error deleting supplier:", error);
            alert("Failed to delete supplier. Please try again.");
        }
    };

    console.log(updatedSupplier, 'SUpplierahiohio')

    const handleSubmit = async () => {
        if (!updatedSupplier || !id) {
            alert("Missing supplier data or ID.");
            return;
        }

        const data = new FormData();
        data.append('name', updatedSupplier.name);
        data.append('email', updatedSupplier.email);
        data.append('contact', updatedSupplier.contact);
        data.append('gstno', updatedSupplier.gstno);
        data.append('address', updatedSupplier.address);

        if (updatedSupplier.profilePic instanceof File) {
            data.append('profilePic', updatedSupplier.profilePic);
        }

        try {
            const response = await axios.put(`http://localhost:8080/supplier/update/${id}`, data);
            console.log("Saved supplier:", response.data);
            handleSuccess("Supplier Updated successfully!");
            dispatch(fetchSuppliers());
            setViewData(supplier);
            setIsEditing(false);
            toggleInfo();
        } catch (error) {
            console.error("Error saving supplier:", error);
            alert("Failed to save supplier. Please try again.");
        }
    };

    return (
        <div className="
        w-[350px]
        md:w-[430px]
        max-w-md
        md:max-w-xl
        min-w-[220px]   
        p-4 px-7
        bg-white
        rounded-xl
        shadow-md
        relative
        text-sm
      ">
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold my-3">
                    {isEditing ? 'Edit ' : 'View'} Supplier details</p>
                <button onClick={toggleInfo} className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm">
                    Close
                </button>
            </div>
            <div className="flex items-center mb-6">
                {isEditing ? <div className="flex flex-col items-start justify-center">
                    <label htmlFor="photo" className="relative cursor-pointer h-[60px] w-[60px] bg-[#EADDFF] text-[#4F378A] rounded-full flex items-center justify-center text-[100px] font-medium transition-colors duration-300">
                        {
                            imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="min-w-10 min-h-15 rounded-full object-cover" />
                            ) : (
                                <div>
                                    <img src={'https://i.pinimg.com/originals/e7/50/6a/e7506ad7996ca5c70ac596f001c0f69b.gif'} alt="Default" className="w-15 h-15 rounded-full object-cover" />
                                </div>
                            )
                        }
                        <span className="absolute bottom-0 right-0 p-[3px] w-[25px] h-[25px] rounded-full text-[25px] flex items-center justify-center text-gray-500 bg-[#D4E7FF]">
                            <RiPencilLine />
                        </span>
                    </label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div> : <>
                    <img
                        src={updatedSupplier.profilePic ? `http://localhost:8080/uploads/${updatedSupplier.profilePic}` : 'https://i.pinimg.com/originals/e7/50/6a/e7506ad7996ca5c70ac596f001c0f69b.gif'}
                        alt="Profile"
                        className="w-15 h-15 sm:w-16 sm:h-16 rounded-full object-cover  sm:mx-0"
                    />
                </>
                }
            </div>
            <div className={`grid  gap-x-8 sm:gap-x-5   grid-cols-2 gap-3 text-gray-800`}>
                <div className='text-xs sm:text-base min-w-25 sm:min-w-50   text-zinc-900'>
                    <label className="block text-gray-500 text-xs">Supplier name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={updatedSupplier.name}
                            onChange={handleChange}
                            className="w-full  border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 cursor-text"
                        />
                    ) : (
                        <p>{updatedSupplier.name}</p>
                    )}
                </div>
                <div className=' text-xs sm:text-base min-w-25 sm:min-w-50   text-zinc-900'>
                    <label className="block text-gray-500 text-xs">Supplier Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={updatedSupplier.email}
                            onChange={handleChange}
                            className=" w-full bg-transparent border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 cursor-text"
                        />
                    ) : (
                        <p className='break-all'>{updatedSupplier.email}</p>
                    )}
                </div>
                <div className='text-xs sm:text-base min-w-25 sm:min-w-50   text-zinc-900'>
                    <label className="block text-gray-500 text-xs">Phone no.</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="contact"
                            value={updatedSupplier.contact}
                            onChange={handleChange}
                            className=" w-full bg-transparent border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150  cursor-text"
                        />
                    ) : (
                        <p>{updatedSupplier.contact}</p>
                    )}
                </div>
                <div className='text-xs sm:text-base min-w-25 sm:min-w-50   text-zinc-900'>
                    <label className="block text-gray-500 text-xs">GST no.</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="gstno"
                            value={updatedSupplier.gstno}
                            onChange={handleChange}
                            className=" w-full bg-transparent border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150  cursor-text"
                        />
                    ) : (
                        <p>{updatedSupplier.gstno}</p>
                    )}
                </div>
                <div className='text-xs sm:text-base min-w-25 sm:min-w-50   text-zinc-900'>
                    <label className="block text-gray-500 text-xs">Address</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="address"
                            value={updatedSupplier.address}
                            onChange={handleChange}
                            className=" w-full border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150  cursor-text"
                        />
                    ) : (
                        <p>{updatedSupplier.address}</p>
                    )}
                </div>
            </div>
            <div className={`flex p-8 py-2 ${isEditing ? 'mt-8' : 'mt-9'} justify-between text-lg items-center`}>
                {
                    isEditing ?
                        (<button onClick={handleSubmit} className="bg-[#00006B] text-white  px-2 md:px-4 py-2 md:py-4 text-sm sm:text-md rounded-lg">
                            {isEditing ? 'Save Supplier' : 'Save Supplier'}
                        </button>) : (<button onClick={handleDelete} className="bg-red-100 flex items-center text-red-700 px-2 md:px-8  py-2 md:py-3 text-sm sm:text-[15px] rounded-md">
                            <MdDelete className='sm:text-[17px]' />
                            <span className="ml-1">Delete</span>
                        </button>)
                }
                <button onClick={handleEditToggle} className="bg-[#D6D6FB] text-[#00006B]  px-2 md:px-8  py-2 md:py-3 text-sm sm:text-[15px] rounded-md">
                    {isEditing ? 'Cancel' :
                        <span
                            className='flex gap-1 items-center'
                        >
                            <MdModeEditOutline className='sm:text-[17px]' />
                            <span>Edit</span>
                        </span>}
                </button>
            </div>
        </div >
    );
}

export default InforCard;
