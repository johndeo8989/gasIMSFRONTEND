import axios from "axios";
import React, { useState } from "react";
import { handleError } from "../../../utils/utils";
import { IoReturnDownBack } from "react-icons/io5";
const ProfileEditCard = ({ userdata }) => {
  const [formData, setFormData] = useState({
    name: userdata.name || "",
    contactNumber: userdata.contact || "",
    email: userdata.email || "",
    address: userdata.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name === "" ||
      !formData.contactNumber === "" ||
      !formData.email === "" ||
      formData.address === ""
    ) {
      return handleError("All Fields Are Required!");
    }

    try {
      const url = `http://localhost:8080/users/updateUserData/${userdata.id}`;

      axios.put(url, formData).then((response) => {
        console.log("UserUpdated", response.data);
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto"
    >
      <h1 className="text-2xl text-left font-bold text-gray-800 mb-6">
        Update Profile
      </h1>
      <div className="space-y-3">
        <div className="text-gray-800 flex items-center">
          <strong className="w-30 text-left">Name:</strong>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-400 ml-2"
          />
        </div>
        <div className="text-gray-800 flex items-center">
          <strong className="w-30 text-left">Contact:</strong>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-400 ml-2"
          />
        </div>
        <div className="text-gray-800 flex items-center">
          <strong className="w-30 text-left">Email:</strong>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-400 ml-2"
          />
        </div>
        <div className="text-gray-800 flex items-center">
          <strong className="w-30 text-left">Address:</strong>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-400 ml-2"
          />
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            className="text-red-500 font-bold px-4 py-1 rounded hover:text-red-800 transition"
            onClick={() => console.log("Logout clicked")}
          >
            <IoReturnDownBack />
          </button>
          <button
            type="submit"
            className="bg-indigo-400 text-white px-4 rounded hover:bg-indigo-500 transition"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileEditCard;
