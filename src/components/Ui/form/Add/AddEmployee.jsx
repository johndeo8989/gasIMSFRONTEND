import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { handleSuccess } from '../../../../utils/utils';
import { useFormContext } from '../../../../context/DisplayForm/FormContext';

const AddEmployee = ({ fetchData }) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    const [formData, setFormData] = useState({
        date: today,
        empName: "",
        empID: "",
        desig: "",
    });

    const { toggleForm } = useFormContext();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    console.log(formData, 'datah')
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/employee/create", formData);

            // Log the entire response for inspection
            console.log("Response:", res);

            // Ensure it's actually a success response
            if (res.status === 200 || res.status === 201) {
                handleSuccess("Employee added successfully!");
                toggleForm()
                setFormData({
                    date: "",
                    empName: "",
                    empID: "",
                    desig: "",
                });
                fetchData()
            } else {
                alert("Unexpected response from server.");
            }
        } catch (error) {
            // Show more specific error if available
            console.error("Axios error:", error);
            alert(error.response?.data?.message || "An error occurred while adding the employee.");
        }
    };




    const [productList, setProductList] = useState([])
    const fetchProduct = async () => {
        try {
            const res = await axios.get("http://localhost:8080/products/get", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
            console.log(res.data)
            setProductList(res.data.map((d) => d.name))
        } catch (error) {
            console.error("failed to fetch product", error);
        } finally {
            console.log('object')
        }
    }

    console.log('0', productList)



    useEffect(() => {
        fetchProduct();
    }, []);
    return (
        <div className="bg-white w-[410px] h-[350px] rounded-lg p-7 px-6 shadow-lg">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() => toggleForm()}>
                    <IoClose />
                </button>
                <p className="font-bold">Add Employee </p>
            </div>

            <form className="flex flex-col space-y-8" onSubmit={handleSubmit} >
                <span className="relative">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-4 block text-xs">
                        {'Date'}:
                    </label>
                    <input type="text" name='date' value={formData.date} readOnly className="w-full p-2 border text-black rounded border-[#c1bdbd] bg-gray-100 text-xs" />
                </span>

                <div className="flex gap-8">
                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Employee Name'}:
                        </label>
                        <input type="text" value={formData.empName} name='empName' onChange={handleChange} className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]" />

                    </span>

                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Employee ID'}:
                        </label>
                        <input type="text" value={formData.empID} name='empID' onChange={handleChange} className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]" />

                    </span>
                </div>


                <span className="relative ">
                    <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                        {'Designation'}:
                    </label>
                    <input type="text" value={formData.desig} name='desig' onChange={handleChange} className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]" />
                </span>



                <div className="flex flex-row gap-4 justify-between">
                    <button type="submit" className="submitBTn text-sm bg-[#00006B] text-white w-[100%] p-3 rounded-lg">
                        Save
                    </button>
                    <button type="submit" className="submitBTn text-sm text-red-500 bg-red-100 w-[100%] p-3 rounded-lg">
                        Cancel
                    </button>
                </div>
            </form>
        </div>

    );
};

export default AddEmployee;
