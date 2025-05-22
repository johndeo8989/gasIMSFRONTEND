import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../context/DisplayForm/FormContext';
import UpdateSellingPriceForm from './UpdateSellingPrice';




const StockPage = () => {
    const { isFormOpen, toggleForm } = useFormContext();

    const [stockItems, setStockItems] = useState([])

    const fetchData = async () => {
        const data = await axios.get('http://localhost:8080/stock')
        setStockItems(data.data)
    }

    useEffect(() => {
        fetchData()
        console.log(stockItems, 'llololl')
    }, [])
    const [data, setData] = useState({})
    return (
        <div className="p-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📦 Stock Inventory
            </h2>
            {isFormOpen &&
                <div className='flex pt-40 justify-center absolute form-container'>
                    <UpdateSellingPriceForm fetchData={fetchData} data={data} />
                </div>
            }
            <div className="overflow-x-auto mt-4 table-container">
                <table className="w-full tax-table text-sm text-gray-800">
                    <thead className="bg-[#dadaff] text-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-2">Product</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">HSN</th>
                            <th className="px-4 py-2">Total Units</th>
                            <th className="px-4 py-2">Cost Price</th>
                            <th className="px-4 py-2">Tax %</th>
                            <th className="px-4 py-2">Selling Price</th>
                            <th className="px-1 max-w-[80px] py-2">Update Selling Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockItems.map((item, index) => (
                            <tr key={index} className="even:bg-[#e9eeff] hover:bg-[#f5f6ff] transition-colors">
                                <td className="px-4 py-2 text-center">{item.product_Name}</td>
                                <td className="px-4 py-2 text-center">{item.category_name}</td>
                                <td className="px-4 py-2 text-center">{item.hsn}</td>
                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                <td className="px-4 py-2 text-center">₹{item.costPrice}</td>
                                <td className="px-4 py-2 text-center">{item.tax.taxPer}%</td>
                                <td className="px-4 py-2 text-center">₹{item.sellingPrice}</td>
                                <td > <button className='text-xs min-w-[90px] p-1 bg-green-200 pointer text-green-600 rounded' onClick={() => { toggleForm(); setData(item) }}> Update Price</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>




    );
};

export default StockPage;
