import React, { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import { useFormContext } from "../../../../context/DisplayForm/FormContext";
import axios from 'axios'
import { handleSuccess } from "../../../../utils/utils";
function PattyBillsForm({ fetchData }) {
    const [formData, setFormData] = useState({
        expenseType: "petty",
        expensePrice: "",
        date: "",
        shortNarration: "",
        additionalInfo: {
            billName: '',
            billNo: ''
        },
        bill: ''
    });

    const fileInputRef = useRef();
    const [imagePreview, setImagePreview] = useState('');
    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
        else {
            setImagePreview(null);
        }
        setFormData((prev) => ({ ...prev, bill: file }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'billName') {
            setFormData((prevState) => ({
                ...prevState,
                additionalInfo: {
                    ...prevState.additionalInfo,
                    billName: value,
                },
            }));
        } else
            if (name === 'billNo') {
                setFormData((prevState) => ({
                    ...prevState,
                    additionalInfo: {
                        ...prevState.additionalInfo,
                        billNo: value,
                    },
                }));
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            }
    };
    console.log('object', formData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'bill') {
                if (value) data.append('bill', value)
            }
            else if (key === 'additionalInfo') {
                data.append(key, JSON.stringify({
                    'billName': value.billName,
                    'billNo': value.billNo
                }))
            } else {
                data.append(key, value)
            }
        })
        console.log('00000---00000', data)
        try {
            const response = await axios.post("http://localhost:8080/expenses/create", data);

            if (response.status === 201) {
                handleSuccess("Expense added successfully!");
                console.log(response.data);
                toggleForm();
                fetchData();
                setFormData({
                    expenseType: "petty",
                    expensePrice: "",
                    date: "",
                    shortNarration: "",
                    additionalInfo: {
                        billName: '', billNo: ''
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


    const { toggleForm } = useFormContext();

    return (
        <div className=" bg-white w-[400px] rounded-lg top-50 left-50 p-7 px-6">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() => toggleForm()}>
                    <IoClose />
                </button>
                <p className="font-bold">Add Bills</p>
            </div>

            <div className="expense_details text-black">
                <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                    <span className="relative ">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-4 block text-xs">
                            {'Date'}:
                        </label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                    </span>

                    <div className=" flex  gap-8">
                        <span className="relative  w-[50%]">
                            <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                                {'Expense Price'}:
                            </label>
                            <input type="number" name="expensePrice" value={formData.expensePrice} onChange={handleChange} className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                        </span>
                        <span className="relative   w-[50%]">
                            <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                                {'Expense Type'}:
                            </label>
                            <input type="text" value='Patty Bills' className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                        </span>
                    </div>
                    <span className="relative">
                        <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                            {'Bill Name'}:
                        </label>
                        <input type="text" name="billName" value={formData.additionalInfo.billName} onChange={handleChange} className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                    </span>
                    <span className="relative">
                        <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                            {'Bill No'}:
                        </label>
                        <input type="text" name="billNo" value={formData.additionalInfo.billNo} onChange={handleChange} className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                    </span>
                    <span className="relative">
                        <label className="absolute -top-4  pb-1 px-2 bg-white left-3 block text-xs">
                            {'Short Narration'}:
                        </label>
                        <input type="text" name="shortNarration" value={formData.shortNarration} onChange={handleChange} className="w-full text-xs p-2 border rounded border-[#c1bdbd]" />
                    </span>

                    <div
                        onClick={handleDivClick}
                        className={`cursor-pointer border-2 border-dashed rounded-md ${formData.additionalInfo.imgUrl ? 'h-65 bg-gray-50' : ' h-25 sm:h-40'} flex flex-col items-center justify-center`}
                    >
                        <div className="text-center text-zinc-800 text-xs sm:text-md font-bold">
                            <IoCloudUploadOutline className=" text-md sm:text-4xl w-full" />
                            Drop files to begin upload, or <span className="underline text-violet-500">browse</span>
                        </div>

                        <input
                            type="file"
                            id="documents"
                            multiple
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e)}
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />


                        <div className="flex w-full flex-wrap items-center gap-6 mt-8 p-2 justify-center">
                            {imagePreview && (
                                <div className="text-center flex flex-col justify-center items-center">
                                    <img src={imagePreview} alt="Preview" className="w-18 h-18 md:w-10 md:h-10 object-cover" />
                                    <p>Bank Passbook</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row gap-4 justify-between">
                        <button className="submitBTn text-sm bg-[#00006B] w-50 text-white p-3 rounded-lg" type="submit">Save</button>
                        <button className="cancelBTn bg-red-100 w-50 text-red-600 p-3 text-sm rounded-lg">Cancel</button>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default PattyBillsForm;
