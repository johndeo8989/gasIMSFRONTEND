import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useFormContext } from "../../../../context/DisplayForm/FormContext";
import axios from "axios";
import { handleSuccess } from "../../../../utils/utils";

function UpdateExpense({ fetchData, setIsEdit, initialData, type }) {

    const adds = {
        'salary': { title: 'Designation', name: 'designation' },
        'transport': { title: 'Total Person', name: 'totalPerson' },
        'maintenance': { title: 'Work', name: 'work' },
        'rent': { title: 'Rent Name', name: 'rent' },
        'marketing': { title: 'Marketing', name: 'marketing' },
        'stationary': { title: 'Stationary', name: 'stationary' },
        'utility': { title: 'Utility', name: 'utility' },
    }


    const [formData, setFormData] = useState({});

    const { toggleForm } = useFormContext();

    useEffect(() => {
        if (initialData) {
            setFormData({
                expenseType: initialData.expenseType || "salary",
                expensePrice: initialData.expensePrice || "",
                date: initialData.date ? initialData.date.slice(0, 10) : "",
                shortNarration: initialData.shortNarration || "",
                additionalInfo: {
                    ...(typeof initialData.additionalInfo === 'object' ? initialData.additionalInfo : {})
                }

            });
        }
    }, [initialData]);
    console.log('initial data', initialData)
    console.log(formData, 'huihihihihihi')

    const handleChange = (e) => {
        const { name, value } = e.target;
        const dynamicName = adds[type.toLowerCase()]?.name;

        if (name === dynamicName) {
            setFormData(prev => ({
                ...prev,
                additionalInfo: {
                    ...prev.additionalInfo,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!initialData?._id) {
            alert("Invalid expense ID for update.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/expenses/${initialData._id}`,
                formData
            );

            if (response.status === 200) {
                handleSuccess("Expense updated successfully!");
                fetchData();
                toggleForm();
            } else {
                alert("Failed to update expense.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating the expense.");
        }
    };

    return (
        <div className="bg-white w-[400px] h-[420px] rounded-lg p-7 px-6">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() => { toggleForm(); setIsEdit(false); }}>
                    <IoClose />
                </button>
                <p className="font-bold">Update {type}</p>
            </div>

            <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <span className="relative">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-4 text-xs">Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                </span>

                <div className="flex gap-8">
                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 text-xs">Expense Price:</label>
                        <input type="number" name="expensePrice" value={formData.expensePrice} onChange={handleChange} className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                    </span>

                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 text-xs">Expense Type:</label>
                        <input type="text" value="Employee Salary" disabled className="w-full text-xs p-2 border rounded border-[#c1bdbd] bg-gray-100" />
                    </span>
                </div>

                <span className="relative">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-3 text-xs">{adds[type.toLowerCase()]?.title}:</label>
                    <input
                        type="text"
                        name={adds[type.toLowerCase()]?.name}
                        value={formData.additionalInfo?.[adds[type.toLowerCase()]?.name] || ""}
                        onChange={handleChange}
                    />

                </span>

                <span className="relative">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-3 text-xs">Short Narration:</label>
                    <input type="text" name="shortNarration" value={formData.shortNarration} onChange={handleChange} className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                </span>

                <div className="flex gap-6 justify-between">
                    <button type="button" onClick={toggleForm} className="bg-red-100 text-red-600 p-3 text-sm rounded-lg">Cancel</button>
                    <button type="submit" className="bg-[#00006B] text-white p-3 text-sm rounded-lg">Update</button>
                </div>
            </form>
        </div >
    );
}

export default UpdateExpense;
