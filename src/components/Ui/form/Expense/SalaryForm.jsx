import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useFormContext } from "../../../../context/DisplayForm/FormContext";
import axios from "axios";
import { handleSuccess } from "../../../../utils/utils";

function SalaryForm({ fetchData }) {
    const [newFormData, setnewFormData] = useState({
        expenseType: "salary",
        expensePrice: "",
        date: "",
        shortNarration: "",
        additionalInfo: {
            designation: ''
        },
    });


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'designation') {
            setnewFormData((prevState) => ({
                ...prevState,
                additionalInfo: {
                    ...prevState.additionalInfo, // Keep other properties in additionalInfo
                    designation: value, // Update only the designation property
                },
            }));
        } else {
            setnewFormData((prevState) => ({
                ...prevState,
                [name]: value, // Update other fields like expenseType, expensePrice, etc.
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/expenses/create", newFormData);

            if (response.status === 201) {
                handleSuccess("Expense added successfully!");
                console.log(response.data);
                toggleForm();
                fetchData()
                setnewFormData({
                    expenseType: "",
                    expensePrice: "",
                    date: "",
                    shortNarration: "",
                    additionalInfo: {
                        designation: ''
                    },
                });
            } else {
                alert("Error: " + (response.data.message || "Failed to add expense."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the expense.");
        }
    };

    console.log('0000--0000', newFormData)

    const { toggleForm } = useFormContext();

    return (
        <div className=" bg-white w-[400px] h-[420px] rounded-lg top-50 left-50 p-7 px-6">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() =>
                    toggleForm()}>
                    <IoClose />
                </button>
                <p className="font-bold">Create Salary</p>
            </div>

            <div className="expense_details text-[#a7a7a7]">
                <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                    <span className="relative ">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-4 block text-xs">
                            {'Date'}:
                        </label>
                        <input type="date" name="date" value={newFormData.date} onChange={handleChange} className="text-xs  text-black w-full p-2 border rounded border-[#c1bdbd]" />
                    </span>

                    <div className=" flex  gap-8">
                        <span className="relative  w-[50%]">
                            <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                                {'Expense Price'}:
                            </label>
                            <input type="number" name="expensePrice" value={newFormData.expensePrice} onChange={handleChange} className="w-full  text-black text-xs p-2 border rounded border-[#c1bdbd]" />
                        </span>
                        <span className="relative   w-[50%]">
                            <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                                {'Expense Type'}:
                            </label>
                            <input type="text" value='Employee Salary' className="w-full text-xs p-2 border rounded  text-black border-[#c1bdbd]" />
                        </span>
                    </div>
                    <span className="relative">
                        <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                            {'Degsignation'}:
                        </label>
                        <input type="text" name="designation" value={newFormData.additionalInfo.designation} onChange={handleChange} className="w-full text-xs p-2 border rounded  text-black border-[#c1bdbd]" />
                    </span>

                    <span className="relative">
                        <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                            {'Short Narration'}:
                        </label>
                        <input type="text" name="shortNarration" value={newFormData.shortNarration} onChange={handleChange} className="w-full text-xs p-2 border rounded  text-black border-[#c1bdbd]" />
                    </span>
                    <div className="flex flex-col gap-4 justify-between">
                        <div className="flex  gap-6 justify-between">
                            <button className="cancelBTn bg-red-100 w-50 text-red-600 p-3 text-sm rounded-lg">Cancel</button>
                            <button className="submitBTn text-sm bg-[#00006B] w-50 text-white p-3 rounded-lg" type="submit">Save</button>
                        </div>
                    </div>
                </form>
            </div>




        </div >
    );
}

export default SalaryForm;
