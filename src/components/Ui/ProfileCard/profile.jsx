import React from "react";

const ProfileCard = ({ setVisibleEdit, userdata }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto">
      <h1 className="text-2xl  text-left font-bold text-gray-800 mb-6">
        Profile
      </h1>
      <div className="space-y-3">
        <p className="text-gray-800 flex">
          <strong className="w-30  text-left">Name:</strong> {userdata.name}
        </p>
        <p className="text-gray-800 flex">
          <strong className="w-30  text-left">Contact:</strong>{" "}
          {userdata.contact}
        </p>
        <p className="text-gray-800 flex">
          <strong className="w-30  text-left">Email:</strong> {userdata.email}
        </p>
        <p className="text-gray-800 flex">
          <strong className="w-30  text-left">Address:</strong>{" "}
          {userdata.address}
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="text-red-500 font-bold px-4 py-1 rounded hover:text-red-800 transition"
            onClick={"onLogout"}
          >
            Logout
          </button>
          <button
            className="bg-indigo-400 text-white px-4  rounded hover:bg-indigo-500 transition"
            onClick={() => setVisibleEdit(true)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
