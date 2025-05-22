import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useFormContext } from '../../context/DisplayForm/FormContext';
import axios from 'axios';
import { handleSuccess } from '../../utils/utils';

const AddProfit = ({ fetchProducts }) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    const [formData, setFormData] = useState({
        date: today,
        productName: "",
        quantity: "",
        perUnitPrice: "",
        totalPrice: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    console.log(formData, 'datah')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalPrice = formData.quantity * formData.perUnitPrice;
        try {
            const res = await axios.post("http://localhost:8080/profit/create", { ...formData, totalPrice });
            if (res.status === 201) {

                handleSuccess("Profit added successfully!");
                toggleForm();
                fetchProducts()
                setFormData({
                    date: "",
                    productName: "",
                    quantity: "",
                    perUnitPrice: "",
                    totalPrice: "",
                });
            } else {
                alert("Error: " + (res.data.message || "Failed to add expense."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the expense.");
        }
    };



    const { toggleForm, } = useFormContext();
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
        <div className="bg-white w-[480px] h-[350px] rounded-lg p-7 px-6 shadow-lg">
            <div className="flex flex-row-reverse justify-between mb-8">
                <button className="text-2xl" onClick={() => toggleForm()}>
                    <IoClose />
                </button>
                <p className="font-bold">Add Profit</p>
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
                            {'Product Name'}:
                        </label>
                        <select value={formData.productName} name='productName' onChange={handleChange} className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]">
                            <option value="" disabled>Select product</option>

                            {productList.map((product) => <option value={product}>{product}</option>
                            )}

                        </select>
                    </span>

                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Quantity'}:
                        </label>
                        <input type="number" value={formData.quantity} name='quantity' onChange={handleChange} className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]" />
                    </span>
                </div>

                <div className="flex gap-8">
                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Per Product Price'}:
                        </label>
                        <input type="number" value={formData.perUnitPrice} name='perUnitPrice' onChange={handleChange} className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd]" />
                    </span>

                    <span className="relative w-[50%]">
                        <label className="absolute -top-4 pb-1 px-2 bg-white left-3 block text-xs">
                            {'Total Price'}:
                        </label>
                        <input type="number" value={formData.quantity * formData.perUnitPrice} readOnly className="w-full p-2 text-black text-xs border rounded border-[#c1bdbd] bg-gray-100" />
                    </span>
                </div>

                <div className="flex flex-row gap-4 justify-between">
                    <button type="submit" className="submitBTn text-sm text-[#00006B] bg-[#DADAFF] w-[100%] p-3 rounded-lg">
                        Add Profit
                    </button>
                </div>
            </form>
        </div>

    );
};

export default AddProfit;
