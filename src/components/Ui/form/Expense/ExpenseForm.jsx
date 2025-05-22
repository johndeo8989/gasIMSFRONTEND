import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useFormContext } from "../../../../context/DisplayForm/FormContext";
import axios from 'axios'
import { useDispatch } from "react-redux";
import { fetchExpense } from '../../../../redux/slices/expenseSlice'
import { handleSuccess } from "../../../../utils/utils";

function ExpenseForm() {

    const dispatch = useDispatch();


    const [formData, setFormData] = useState({
        date: "",
        expensePrice: "",
        expenseType: '',
        shortNarration: "",
        longNarration: "",
    });

    const { isFormOpen, toggleForm, viewData, setViewData } = useFormContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post("http://localhost:8080/expenses/create", formData);

            if (response.status === 201) {

                handleSuccess("Expense added successfully!");
                console.log(response.data);
                toggleForm();
                dispatch(fetchExpense())
                setFormData({
                    date: "",
                    expensePrice: "",
                    expenseType: '',
                    shortNarration: "",
                    longNarration: "",
                });
            } else {
                alert("Error: " + (response.data.message || "Failed to add expense."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the expense.");
        }
    };


    const handleCancel = () => {
        setFormData({
            date: "",
            expensePrice: "",
            expenseType: '',
            shortNarration: "",
            longNarration: "",
        });
        toggleForm();

    };

    console.log('object', formData)
    return (
        <div className="bg-white w-[400px] h-[420px] rounded-lg top-50 left-50 p-7 px-6">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={toggleForm}>
                    <IoClose />
                </button>
                <p className="font-bold">Expense Form</p>
            </div>

            <div className="expense_details text-[#a7a7a7]">
                <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                    <span className="relative">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-4 block text-xs">
                            {'Date'}:
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="text-xs text-black w-full p-2 border rounded border-[#c1bdbd]"
                        />
                    </span>

                    <div className="flex gap-8">
                        <span className="relative w-[50%]">
                            <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                                {'Expense Price'}:
                            </label>
                            <input
                                type="text"
                                name="expensePrice"
                                value={formData.expensePrice}
                                onChange={handleChange}
                                className="w-full text-black text-xs p-2 border rounded border-[#c1bdbd]"
                            />
                        </span>

                        <span className="relative w-[50%]">
                            <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                                {'Expense Type'}:
                            </label>
                            <select
                                name="expenseType"
                                value={formData.expenseType}
                                onChange={handleChange}
                                className="w-full text-black text-xs p-2 border rounded border-[#c1bdbd]"
                            >
                                {[{ name: 'Employee Salary', value: 'salary' }, { name: 'Transportation Costs', value: 'transport' }, { name: 'Maintenance repairs', value: 'maintenance' }, { name: 'Rent', value: 'rent' }, { name: 'Marketing', value: "marketing" }, { name: 'Stationary', value: "stationary" }, { name: 'Utility Bills', value: 'utility' }, { name: 'Fatty Bills', value: 'petty' }].map((type, index) => (
                                    <option key={index} value={type.value}>{type.name}</option>
                                ))}
                            </select>
                        </span>
                    </div>

                    <span className="relative">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Short Narration'}:
                        </label>
                        <input
                            type="text"
                            name="shortNarration"
                            value={formData.shortNarration}
                            onChange={handleChange}
                            className="w-full text-black text-xs p-2 border rounded border-[#c1bdbd]"
                        />
                    </span>

                    <span className="relative">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Long Narration'}:
                        </label>
                        <input
                            type="text"
                            name="longNarration"
                            value={formData.longNarration}
                            onChange={handleChange}
                            className="w-full text-black text-xs p-2 border rounded border-[#c1bdbd]"
                        />
                    </span>

                    <div className="flex items-center gap-6 justify-between">
                        <button className="submitBTn text-sm bg-[#00006B] w-50 text-white p-3 rounded-lg" type="submit">Add Expense</button>
                        <button
                            className="cancelBTn bg-red-100 w-50 text-red-600 p-3 text-sm rounded-lg"
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ExpenseForm;
