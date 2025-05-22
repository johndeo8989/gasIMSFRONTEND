import React, { useState } from "react";
import axios from "axios";
import { useFormContext } from "../../context/DisplayForm/FormContext";
import { handleError, handleSuccess } from "../../utils/utils";

const UpdateSellingPriceForm = ({ data, fetchData }) => {
    const { _id, sellingPrice } = data;
    const [newPrice, setNewPrice] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/stock/updateSellingPrice/${_id}`, {
                sellingPrice: newPrice,
            });
            toggleForm(); fetchData()
            handleSuccess("Price updated!");
        } catch (err) {
            handleError("Error updating price");
        }
    };
    console.log(_id,sellingPrice)
    const { toggleForm } = useFormContext()
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-sm space-y-4"
        >
            <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm font-medium">
                    Current Price: ₹{sellingPrice}
                </p>
                <button className="bg-red-200 text-red-600 rounded p-1 text-xs" onClick={toggleForm}>close</button>
            </div>
            <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new selling price"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50"
            />

            <button
                type="submit"
                className="w-full bg-gray-800 text-white text-sm py-2 rounded-md hover:bg-gray-700 transition duration-150"
            >
                Update Price
            </button>
        </form>


    );
};

export default UpdateSellingPriceForm;
