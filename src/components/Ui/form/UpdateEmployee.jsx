import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { handleSuccess } from '../../../utils/utils';
import { useFormContext } from '../../../context/DisplayForm/FormContext';

const UpdateEmployee = ({ fetchData, employeeData, setEdit }) => {
    const { toggleForm } = useFormContext();

    const [formData, setFormData] = useState({
        date: '',
        empName: '',
        empID: '',
        desig: '',
    });

    useEffect(() => {
        if (employeeData) {
            setFormData({
                date: employeeData.date?.split('T')[0] || '',
                empName: employeeData.empName || '',
                empID: employeeData.empID || '',
                desig: employeeData.desig || '',
            });
        }
    }, [employeeData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:8080/employee/${employeeData._id}`,
                formData
            );
            setEdit(false);
            if (res.status === 200 || res.status === 204) {
                handleSuccess("Employee updated successfully!");
                toggleForm();
                fetchData();
            } else {
                alert("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert(error.response?.data?.message || "Failed to update employee.");
        }
    };

    return (
        <div className="bg-white w-[410px] h-[350px] rounded-lg p-7 px-6 shadow-lg">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() => {
                    setEdit(false);
                    toggleForm()
                }}>
                    <IoClose />
                </button>
                <p className="font-bold">Update Employee</p>
            </div>

            <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <span className="relative">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-4 block text-xs">Date:</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        readOnly
                        className="w-full p-2 border text-black rounded border-[#c1bdbd] bg-gray-100 text-xs"
                    />
                </span>

                <div className="flex gap-8">
                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">Employee Name:</label>
                        <input
                            type="text"
                            name="empName"
                            value={formData.empName}
                            onChange={handleChange}
                            className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]"
                        />
                    </span>

                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">Employee ID:</label>
                        <input
                            type="text"
                            name="empID"
                            value={formData.empID}
                            onChange={handleChange}
                            className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]"
                        />
                    </span>
                </div>

                <span className="relative">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">Designation:</label>
                    <input
                        type="text"
                        name="desig"
                        value={formData.desig}
                        onChange={handleChange}
                        className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]"
                    />
                </span>

                <div className="flex flex-row gap-4 justify-between">
                    <button type="submit" className="submitBTn text-sm bg-[#00006B] text-white w-[100%] p-3 rounded-lg">
                        Update
                    </button>
                    <button type="button" onClick={toggleForm} className="submitBTn text-sm text-red-500 bg-red-100 w-[100%] p-3 rounded-lg">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateEmployee;
