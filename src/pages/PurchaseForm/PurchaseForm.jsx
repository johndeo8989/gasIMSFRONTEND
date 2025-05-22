import React, { useEffect, useState } from 'react'
import './PurchaseForm.css' 
import { GoArrowLeft } from "react-icons/go";
import axios from 'axios';
import { IoMdTrash } from "react-icons/io";


const PurchaseForm = () => {
    const generate = Math.floor(Math.random() * 1000000); // Random ID generation logic
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD


    const [addedProducts, setAddedProducts] = useState([]);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedTax, setSelectedTax] = useState(null);

    const [productName, setProductName] = useState("");
    const [image, setImage] = useState(null);
    const [supplierName, setSupplierName] = useState("");
    const [unitPerPrice, setUnitPerPrice] = useState("");
    const [unit, setUnit] = useState("");
    const [tax, setTax] = useState("");

    const [supplierList, setSupplierList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [taxList, setTaxList] = useState([]);

    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [filteredTax, setFilteredTax] = useState([]);

    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showTaxDropdown, setShowTaxDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token");
            const [suppliers, product, tax] = await Promise.all([
              axios.get("http://localhost:8080/supplier/get", {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get("http://localhost:8080/products/get", {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get("http://localhost:8080/tax/getalltax", {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);
            setSupplierList(suppliers.data.suppliers);
            setProductList(product.data);
            setTaxList(tax.data);
          } catch (error) {
            console.error("Error loading dropdown data", error);
          }
        };
        fetchData();
    }, []);
    
    const basePrice = unit * unitPerPrice;
    const taxAmount = (basePrice * selectedTax?.percentage) / 100;
    const totalPrice = basePrice + taxAmount;
    
    const handleAddItem = (e) => {
      e.preventDefault();
      if (!selectedProduct || !selectedTax || !supplierName || !unit || !unitPerPrice) {
        alert("Please fill all required fields.");
        return;
      }
    
      const newItem = {
        productId: selectedProduct._id,
        product_Name: selectedProduct.name,
        category_name: selectedProduct.category,
        hsn: selectedProduct.hsn,
        noOfUnit: parseInt(unit),
        perUnitPrice: parseFloat(unitPerPrice),
        price: totalPrice,
        taxName: selectedTax.name,
        taxPer: selectedTax.percentage,
        image: selectedProduct.image || null
      };
    
      setAddedProducts([...addedProducts, newItem]);
      
      
      // Clear form fields
      setProductName("");
      setSelectedProduct(null);
      setUnit("");
      setUnitPerPrice("");
      setTax("");
      setSelectedTax(null);
      setImage(null);
    };
    
    // useEffect(() => {
    //   const storedProducts = localStorage.getItem("addedProducts");
    //     if (storedProducts) {
    //       setAddedProducts(JSON.parse(storedProducts));
    //   // setData(prev => ({ ...prev, paidAmount: grandTotal, dueAmount: 0 }));
    //     }
    // },[]);

    // useEffect(() => {
    //  console.log("Added Products:", addedProducts);
    //  localStorage.setItem("addedProducts", JSON.stringify(addedProducts));
    // },[addedProducts]);

    const grandTotal = addedProducts.reduce((sum, item) => {
      return sum + Number(item.price || 0);
    }, 0);

    useEffect(() => {
      setData((prev) => {
        let paidAmount = prev.paidAmount;
        let dueAmount = prev.dueAmount;
    
        if (prev.paidStatus === "paid") {
          paidAmount = grandTotal;
          dueAmount = 0;
        } else if (prev.paidStatus === "unpaid") {
          paidAmount = 0;
          dueAmount = grandTotal;
        } else if (prev.paidStatus === "partial") {
          paidAmount = prev.paidAmount || "";
          dueAmount = Math.max(grandTotal - (parseFloat(prev.paidAmount) || 0), 0);
        }
    
        return {
          ...prev,
          totalPrice: grandTotal,
          paidAmount,
          dueAmount,
        };
      });
    }, [grandTotal]);
    
    
    const handleDeleteItem = (index) => {
      try {
        const updatedProducts = addedProducts.filter((_, idx) => idx !== index);
        setAddedProducts(updatedProducts);
      } catch(e) {
        console.error("there is an error on handleDeleteItem = ", e);
      }
      console.log("delete button clicked");
    } 

      console.log(supplierList, productList);
      console.log("filteredSuppliers-----",filteredSuppliers);
      console.log('selected tax', selectedTax);
    
    // ============================== purchseForm logic =============================  
    const [isDueDateDisabled, setIsDueDateDisabled] = useState(true);

    const [data, setData] = useState({
      id: generate, // Your own logic for ID
      date: formattedDate, // Your logic for today's date
      dispatchNo: "",         // Vehicle No.
      dispatchThrough: "",    // Shipped by
      paidStatus: "paid",     // paid | unpaid | partial
      paidAmount: "",         // initial paid amount
      dueAmount: "",          // total due
      dueDate: "",            // date of due
      paymentMode: "",        // cash/cheque/card/upi
      referenceNo: "",        // ref no.
      payments: [],           // array of { amount, paymentMode, referenceNo }
      product: addedProducts, // product list
      suplire_Email: "",      
      supplierDetail: {},
      totalPrice: grandTotal,
      status: "Pending", // always initially Pending
    });

    const handleInputChange = (e) => {
      const { id, value } = e.target;
      if (id === "paidAmount" && data.paidStatus === "partial") {
        const paid = parseFloat(value) || 0;
        const due = Math.max(data.totalPrice - paid, 0);
    
        setData((prev) => ({
          ...prev,
          [id]: value,
          dueAmount: due,
        }));
      } else {
        setData((prev) => ({
          ...prev,
          [id]: value,
        }));
      }
    };
    
    const handlePaymentModeChange = (e) => {
      setData(prev => ({ ...prev, paymentMode: e.target.value }));
    };
  
    const handlePaidStatusChange = (e) => {
      const value = e.target.value;
    
      if (value === "paid") {
        setData((prev) => ({
          ...prev,
          paidStatus: value,
          paidAmount: prev.totalPrice,
          dueAmount: 0,
        }));
        setIsDueDateDisabled(true);
    
      } else if (value === "unpaid") {
        setData((prev) => ({
          ...prev,
          paidStatus: value,
          paidAmount: 0,
          dueAmount: prev.totalPrice,
        }));
        setIsDueDateDisabled(false);
    
      } else if (value === "partial") {
        setData((prev) => ({
          ...prev,
          paidStatus: value,
          paidAmount: "",
          dueAmount: "",
        }));
        setIsDueDateDisabled(false);
      }
    };
    
    const handlePurchseSubmit = async (e) => {
      e.preventDefault();
      const {
        paidAmount,
        dueAmount,
        paymentMode,
        referenceNo,
        paidStatus,
        product,
        totalPrice
      } = data;
    
      // Basic Validation
      if (!paidStatus || !paymentMode) {
        alert("Please fill all required fields");
        return;
      }
      
      if(paidAmount > totalPrice){
        alert("Paid amount is greater than total price");
        return;
      }
    
      const paymentEntry = {
        amount: Number(paidAmount),
        paymentMode,
        referenceNo,
      };
    
      const finalData = {
        ...data,
        payments: [paymentEntry],
        totalPrice: grandTotal,
        product: addedProducts,
        suplire_Email: selectedSupplier.email,      
        supplierDetail: selectedSupplier,
      };
      console.log("Final Data:", finalData);
      const resetForm = () => {
          setData({
            id: generate,              // regenerate ID if needed
            date: formattedDate,       // today’s date again
            dispatchNo: "",
            dispatchThrough: "",
            paidStatus: "paid",
            paidAmount: "",
            dueAmount: "",
            dueDate: "",
            paymentMode: "",
            referenceNo: "",
            payments: [],
            product: [],               // empty product list
            suplire_Email: "",
            supplierDetail: {},
            totalPrice: 0,
            status: "Pending",
          });
      };

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:8080/purchase/add", finalData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
    
        alert("Purchase submitted successfully");
        resetForm();
        setSupplierName("");
        setSelectedSupplier(null);
        setAddedProducts([]);
      } catch (err) {
        console.error("Error creating purchase", err);
        alert("Failed to submit purchase");
      }
    };

  return (
    <div>
        <div className="ph1 flex items-center justify-between">
            <div className="back_title flex items-center gap-4">
              <button className='back-icon cursor-pointer'><GoArrowLeft /></button>
              <h3 style={{fontSize: "20px"}}>New Purchase</h3>
            </div>
            <h3 style={{fontSize: "18px"}}>Added Product : {addedProducts.length}</h3>
        </div>
        <form action="">
          <div className="form1">
            <div className="input-groups">
                <label htmlFor="supplierName">Supplier Name</label>
                <input type="text" id='supplierName' placeholder='Supplier Name'
                   value={supplierName}
                   onChange={(e) =>{
                    setSupplierName(e.target.value);
                    const filtered = supplierList.filter((supplier) =>
                      supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setFilteredSuppliers(filtered);
                    setShowSupplierDropdown(e.target.value.trim() !== "");
                   }}
                   onFocus={() => {
                     if (supplierName.trim() !== "") setShowSupplierDropdown(true);
                   }}
                   onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 100)}
                   required/>
                {showSupplierDropdown && filteredSuppliers.length > 0 && (
                    <ul className="custom-select-list">
                        {filteredSuppliers.map((sup, idx) => (
                        <li key={idx} onClick={() => {
                          setSupplierName(sup.name);
                          setSelectedSupplier(sup);
                        }}>
                            {sup.name}
                        </li>
                        ))}
                    </ul>
                )}   
            </div>
            <div className="input-groups">
                <label htmlFor="productName">Product Name</label>
                <input type="text" id='productName' placeholder='Product Name'
                 value={productName}
                 onChange={(e) => {
                    setProductName(e.target.value);
                    const filtered = productList.filter((product) =>
                      product.name.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setFilteredProduct(filtered);
                    setShowProductDropdown(e.target.value.trim() !== "");
                  }}
                  onFocus={() => {
                    if (productName.trim() !== "") setShowProductDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowProductDropdown(false), 100)}
                required/>
                {showProductDropdown && filteredProduct.length > 0 && (
                    <ul className="custom-select-list">
                        {filteredProduct.map((product, idx) => (
                        <li key={idx} onClick={() => {
                          setProductName(product.name);
                          setSelectedProduct(product);
                          setImage(product.image);  
                        }}>
                            {product.name}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="input-groups">
                <label htmlFor="unitperprice">Unit Per Price</label>
                <input type="number" value={unitPerPrice} onChange={(e) => setUnitPerPrice(e.target.value)} id='unitperprice' placeholder='Unit Per Price' required/>
            </div>
            <div className="input-groups">
                <label htmlFor="unit">No. of Unit</label>
                <input type="number" value={unit} onChange={(e) => setUnit(e.target.value)} id='unit' placeholder='No. of Unit' required/>
            </div>
            <div className="input-groups">
                <label htmlFor="tax">Tax</label>
                <input type="text" id='tax' placeholder='Tax' 
                value={tax}
                onChange={(e) => {
                    setTax(e.target.value);
                    const filtered = taxList.filter((tax) =>
                      tax.name.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setFilteredTax(filtered);
                    setShowTaxDropdown(e.target.value.trim() !== "");
                  }}
                  onFocus={() => {
                    if (tax.trim() !== "") setShowTaxDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowTaxDropdown(false), 100)}
                required/>
                {showTaxDropdown && filteredTax.length > 0 && (
                    <ul className="custom-select-list">
                        {filteredTax.map((tax, idx) => (
                        <li key={idx} onClick={() => {
                          setTax(tax.name);
                          setSelectedTax(tax);
                        }}>
                            {tax.name}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="input-groups">
                <label htmlFor="totalprice">Total Price</label>
                <input type="number" id='totalprice' placeholder='Total Price' value={isNaN(totalPrice) ? "" : Math.round(totalPrice)} readOnly required/>
            </div>
          </div>  
          <div className="addpurchase">
             <button type='submit' onClick={handleAddItem}>Add item</button>
          </div>
        </form>
        {addedProducts.length > 0 && (
          <div className="table-container">
              <table className='addpurchse-table' style={{fontSize: "16px"}}>
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>HSN</th>
                      <th>Units</th>
                      <th style={{minWidth: "100px"}}>Unit Price</th>
                      <th style={{minWidth: "140px"}}>Tax</th>
                      <th style={{minWidth: "100px"}}>Total Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedProducts.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.product_Name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.hsn}</td>
                        <td>{item.noOfUnit}</td>
                        <td>{item.perUnitPrice}</td>
                        <td>{item.taxName} ({item.taxPer}%)</td>
                        <td>{Math.round(item.price)}</td>
                        <td>
                          <div className="delete-purchase-product flex items-center justify-center" >
                            <IoMdTrash className='del-product' 
                            onClick={(e) => {
                              // e.stopPropagation(); // Prevents click from bubbling up
                              handleDeleteItem(idx); // Now this runs on click, not during render
                            }}/>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
          </div>
        )}
        {addedProducts.length > 0 && (
          <div style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'right', color: "#00006b",  }}>
            <p>Grand Total: ₹ {Math.round(grandTotal)}</p>
          </div>
        )}
        <form action="">
            <h3 className='mt-6 text-xl' style={{color: "#00006b"}}>Payment Details</h3>
            <div className="form2">
                <div className="input-groups">
                    <label htmlFor="paidStatus">Payment Status</label>
                    <select name="status" id="paidStatus" onChange={handlePaidStatusChange} value={data.paidStatus}>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                    </select>
                </div>
                <div className="input-groups">
                    <label htmlFor="paidAmount">Paid Amount</label>
                    <input type="number" id='paidAmount' placeholder='Paid Amount' onChange={handleInputChange} value={data.paidAmount !== "" ? Math.round(data.paidAmount) : ""} readOnly={data.paidStatus !== "partial"} required/>
                </div>
                <div className="input-groups">
                    <label htmlFor="dueAmount">Due Amount</label>
                    <input type="number" id='dueAmount' placeholder='Due Amount' onChange={handleInputChange} value={Math.round(data.dueAmount)} readOnly required/>
                </div>
                <div className="input-groups">
                    <label htmlFor="dueDate">Due Date</label>
                    <input type="date" id='dueDate' onChange={handleInputChange} value={data.dueDate} disabled={isDueDateDisabled} required/>
                </div>
                <div className="input-groups">
                    <label htmlFor="dispatchThrough">Shipped by</label>
                    <input type="text" id='dispatchThrough' placeholder='Shipped by' onChange={handleInputChange} value={data.dispatchThrough} required/>
                </div>
                <div className="input-groups">
                    <label htmlFor="dispatchNo">Vehicle no.</label>
                    <input type="text" id='dispatchNo' placeholder='Vehicle No.' onChange={handleInputChange} value={data.dispatchNo} required/>
                </div>
            </div>
            <div className="payment">
                <div className="payment-groups">
                  <h3 className='mb-4'>Payment mode</h3>
                  <div className="payment-mode">
                    <div className="cash">
                        <label htmlFor="cash">Cash</label>
                        <input type="radio" name="payment" id='cash' value="cash" checked={data.paymentMode === 'cash'} onChange={handlePaymentModeChange} required/>
                    </div>
                    <div className="cheque">
                        <label htmlFor="cheque">Cheque</label>
                        <input type="radio" name="payment" id='cheque' value="cheque" checked={data.paymentMode === "cheque"} onChange={handlePaymentModeChange} required/>
                    </div>
                      <div className="card">
                          <label htmlFor="card">Card</label>
                          <input type="radio" name="payment" id='card' value="card" checked={data.paymentMode === "card"} onChange={handlePaymentModeChange} required/>
                      </div>
                      <div className="upi">
                          <label htmlFor="upi">UPI</label>
                          <input type="radio" name="payment" id='upi' value="upi" checked={data.paymentMode === 'upi'} onChange={handlePaymentModeChange} required/>
                      </div>   
                  </div>
                </div>
                <div className="payment-ref">
                    <label htmlFor="referenceNo">Reference No.</label>
                    <input type="text" id='referenceNo' placeholder='Reference No.' onChange={handleInputChange} value={data.referenceNo} disabled={!(data.paymentMode === "cheque" || data.paymentMode === "card" || data.paymentMode === "upi")} required/>
                </div>
                <button type='submit' onClick={handlePurchseSubmit}>Purchase</button>
            </div>
        </form>
    </div>
  )
}

export default PurchaseForm