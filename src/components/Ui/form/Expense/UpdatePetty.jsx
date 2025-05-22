import React, { useRef, useState, useEffect } from "react";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import { useFormContext } from "../../../../context/DisplayForm/FormContext";
import axios from 'axios';
import { handleSuccess } from "../../../../utils/utils";

function UpdatePetty({ fetchData, setIsEdit, initialData }) {
    const [formData, setFormData] = useState({});
    const fileInputRef = useRef();
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {

        let info = {};
        try {
            info = JSON.parse(initialData.additionalInfo || '{}');
        } catch (e) {
            console.error('Invalid JSON in additionalInfo:', e);
        }


        if (initialData) {
            setFormData({
                expenseType: initialData.expenseType || "petty",
                expensePrice: initialData.expensePrice || "",
                date: initialData.date ? initialData.date.slice(0, 10) : "",
                shortNarration: initialData.shortNarration || "",
                additionalInfo: {
                    billName: info?.billName || '',
                    billNo: info?.billNo || ''
                },
                bill: '',
            });

            if (initialData.billUrl) {
                setImagePreview(initialData.bill);
            }
        }
    }, [initialData]);
    console.log('object', formData)
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
        } else {
            setImagePreview(null);
        }
        setFormData((prev) => ({ ...prev, bill: file }));
    };
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
            console.log('hihihi', key, ':', value)
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
        console.log('----------------', data)
        try {
            const response = await axios.put(`http://localhost:8080/expenses/${initialData._id}`
                , data);
            if (response.status === 200) {
                handleSuccess("Expense updated successfully!");
                toggleForm();
                fetchData();
                setIsEdit(false);
            } else {
                alert("Update failed: " + (response.data.message || "Something went wrong."));
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("An error occurred while updating the expense.");
        }
    };

    const { toggleForm } = useFormContext();

    return (
        <div className="bg-white w-[400px] rounded-lg p-7 px-6">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() => toggleForm()}>
                    <IoClose />
                </button>
                <p className="font-bold">Update Bill</p>
            </div>

            <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <span className="relative">
                    <label className="absolute -top-4 px-2 bg-white left-4 text-xs">Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                </span>

                <div className="flex gap-8">
                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 px-2 bg-white left-3 text-xs">Expense Price:</label>
                        <input type="number" name="expensePrice" value={formData.expensePrice} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                    </span>
                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 px-2 bg-white left-3 text-xs">Expense Type:</label>
                        <input type="text" value="Petty Bills" readOnly className="text-xs w-full p-2 border rounded border-[#c1bdbd] bg-gray-100" />
                    </span>
                </div>

                <span className="relative">
                    <label className="absolute -top-4 px-2 bg-white left-3 text-xs">Bill Name:</label>
                    <input type="text" name="billName" value={formData.additionalInfo?.billName} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                </span>

                <span className="relative">
                    <label className="absolute -top-4 px-2 bg-white left-3 text-xs">Bill No:</label>
                    <input type="text" name="billNo" value={formData.additionalInfo?.billNo} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                </span>

                <span className="relative">
                    <label className="absolute -top-4 px-2 bg-white left-3 text-xs">Short Narration:</label>
                    <input type="text" name="shortNarration" value={formData.shortNarration} onChange={handleChange} className="text-xs w-full p-2 border rounded border-[#c1bdbd]" />
                </span>

                <div onClick={handleDivClick} className="cursor-pointer border-2 border-dashed rounded-md h-40 flex flex-col items-center justify-center">
                    <IoCloudUploadOutline className="text-3xl mb-2 text-gray-700" />
                    <p className="text-xs text-gray-500">Drop files or <span className="underline text-blue-500">browse</span></p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".jpg,.jpeg,.png,.pdf" />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-16 h-16 object-cover" />}
                </div>

                <div className="flex justify-between">
                    <button type="submit" className="bg-[#00006B] text-white text-sm px-6 py-2 rounded-lg">Update</button>
                    <button type="button" onClick={() => setIsEdit(false)} className="bg-red-100 text-red-600 text-sm px-6 py-2 rounded-lg">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default UpdatePetty;
