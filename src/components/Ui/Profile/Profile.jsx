import React from 'react';
import { MdOutlineEdit } from "react-icons/md";

const Profile = () => {
    return (
        <div className="max-w-md mx-auto mt-5 p-5 bg-white shadow-lg  rounded-2xl">
            <h2 className="text-2xl text-left font-bold mb-4">Profile</h2>
            <span className="text-lg mb-2 flex items-center justify-between">
                <strong className='w-40 text-left'>Name:</strong> <p className=' text-left flex-1'>John Doe</p>
            </span>
            <span className="text-lg mb-2 flex items-center justify-between">
                <strong className='w-40 text-left'>Email:</strong> <p className=' text-left flex-1'>john.doe@example.com</p>
            </span>
            <span className="text-lg mb-2 flex items-center justify-between">
                <strong className='w-40 text-left'>Contact No:</strong><p className=' text-left flex-1'>+1234567890</p>
            </span>
            <span className="text-lg mb-4 flex items-center justify-between">
                <strong className='w-40 text-left'>Address:</strong> <p className=' text-left flex-1'>123 Main Street, City, Country</p>
            </span>
            <div className="flex justify-center gap-5">
                <button className="px-4 py-2 font-bold text-red-500  rounded hover:text-red-600">
                    Logout
                </button>
                <button className="px-4  flex items-center gap-1 py-2 bg-indigo-300 text-stone-900 hover:text-stone-200 rounded-md font-bold hover:bg-indigo-400">
                    <MdOutlineEdit /> Edit
                </button>
            </div>
        </div>
    );
};

export default Profile;
