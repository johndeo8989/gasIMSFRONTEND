import axios from "axios";
import React, { useState } from "react";
import {
  MdOutlineLocationOn,
  MdOutlineLocalPhone,
  MdMailOutline,
  MdDescription,
} from "react-icons/md";
import { handleSuccess } from "../../../utils/utils";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers } from '../../../redux/slices/SupplierSlice';
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import profile from './profile.jpeg'
import { RiPencilLine } from "react-icons/ri";

const VendorCard = ({ vendor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { setViewData } = useFormContext();
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();
  const { vendors } = useSelector(state => state.vendor);
  const [updatedVendor, setUpdatedVendor] = useState({
    name: vendor.name,
    email: vendor.email,
    contact: vendor.contact,
    shopName: vendor.shopName,
    address: vendor.address,
    profilePic: vendor.profilePic
  });
  const id = vendor._id;

  console.log(updatedVendor, 'ooo009vendor')
  const handleSubmit = async () => {
    if (!updatedVendor || !id) {
      alert("Missing supplier data or ID.");
      return;
    }

    const data = new FormData();

    data.append('name', updatedVendor.name)
    data.append('email', updatedVendor.email)
    data.append('contact', updatedVendor.contact)
    data.append('shopName', updatedVendor.shopName)
    data.append('address', updatedVendor.address)
    data.append('profilePic', updatedVendor.profilePic)
    try {
      const response = await axios.put(`http://localhost:8080/vendor/update/${id}`, data);
      console.log("Saved supplier:", response.data);
      handleSuccess("Vendor Updated successfully!");
      dispatch(fetchSuppliers())
      setViewData(vendors)
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Failed to save supplier. Please try again.");
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) {
      return;
    }
    if (!id) {
      alert("Missing vendor ID.");
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:8080/vendor/delete/${id}`);
      console.log("Deleted vendor:", response.data);
      handleSuccess("Vendor deleted successfully!");
      dispatch(fetchSuppliers());
      setViewData(vendors)
      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Failed to delete vendor. Please try again.");
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
    setUpdatedVendor((prev) => ({ ...prev, profilePic: file }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVendor((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className={`bg-sky-50 min-w-[300px]  relative dark:bg-red-500 w-[90%] max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl shadow-sm rounded-xl p-5 sm:p-6 md:p-4 mx-auto`} >

      <div className={`flex  flex-row sm:items-center  gap-4 ${isEditing ? 'mt-5' : 'mt-2'} `}>
        {isEditing ? <div className="flex flex-col items-start justify-center">
          <label htmlFor="photo" className="relative cursor-pointer h-[60px] w-[60px] bg-[#EADDFF] text-[#4F378A] rounded-full flex items-center justify-center text-[100px] font-medium transition-colors duration-300">
            {
              imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div>
                  <img src={profile} alt="Default" className="w-15 h-15 rounded-full object-cover" />
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
            src={vendor.profilePic ? `http://localhost:8080/uploads/${vendor.profilePic}` : profile}
            alt="Profile"
            className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
          />
        </>
        }
        <div className="text-left flex-1">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={updatedVendor.name}
              onChange={handleChange}
              className="bg-transparent border-b mb-2   flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 w-full cursor-text"
            />
          ) : (
            <p>{updatedVendor.name}</p>
          )}
          <p className="text-sm text-gray-500 flex items-center justify-start gap-1">
            <MdOutlineLocationOn className="text-lg" />
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={updatedVendor.address}
                onChange={handleChange}
                className="bg-transparent border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 w-full cursor-text"
              />
            ) : (
              <p>{updatedVendor.address}</p>
            )}
          </p>
        </div>
        <button onClick={handleEditToggle} className="bg-violet-100 absolute top-4 right-4 text-violet-700 px-3 py-1 rounded-md text-sm">
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <hr className="border-gray-200 my-3" />
      <div className="text-sm sm:text-base text-gray-700 space-y-3 font-medium">
        <div className={`flex ${isEditing ? 'flex-col' : 'flex-row'} sm:items-center`}>
          <strong className={`${isEditing ? 'w-full' : 'w-30'} text-[14px] sm:text-sm text-zinc-400 flex items-center gap-2`}>
            <MdOutlineLocalPhone />
            Phone:
          </strong>
          {isEditing ? (
            <input
              type="text"
              name="contact"
              value={updatedVendor.contact}
              onChange={handleChange}
              className="bg-transparent border-b  flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 w-full cursor-text"
            />
          ) : (
            <p className=" flex-1">{updatedVendor.contact}</p>
          )}
        </div>
        <div className={`flex ${isEditing ? 'flex-col' : 'flex-row'} sm:items-center`}>
          <strong className={`${isEditing ? 'w-full' : 'w-30'} text-zinc-400 flex items-center gap-2`}>
            <MdMailOutline />
            Email:
          </strong>
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={updatedVendor.email}
              onChange={handleChange}
              className="bg-transparent border-b   flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 w-full cursor-text"

            />
          ) : (
            <p className="text-wrap break-all flex-1">{updatedVendor.email}</p>
          )}
        </div>

        <div className={`flex ${isEditing ? 'flex-col' : 'flex-row'} sm:items-center`}>
          <strong className={`${isEditing ? 'w-full' : 'w-30'} text-zinc-400 flex items-center gap-2`}>
            <MdDescription />
            Shop Name:
          </strong>
          {isEditing ? (
            <input
              type="text"
              name="shopName"
              value={updatedVendor.shopName}
              onChange={handleChange}
              className="bg-transparent border-b flex-1 border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-150 w-full cursor-text"
            />
          ) : (
            <p className=" flex-1">{updatedVendor.shopName}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setIsEditing(false);
                handleSubmit()
                console.log("Changes saved:", updatedVendor);
              }}
              className="bg-[#00006B] text-white px-2 py-1 rounded-md transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                handleDelete()
              }}
              className="bg-red-200 text-red-600 px-2 py-1 rounded-md transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div >
  );
};

export default VendorCard;
