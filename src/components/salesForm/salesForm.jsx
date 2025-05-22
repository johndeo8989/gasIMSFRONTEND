import { useEffect, useState } from 'react';
import './SalesForm.css';
import { GoArrowLeft } from "react-icons/go";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils/utils'
const SalesForm = () => {

  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState({})

  const [priceList, setpriceList] = useState([]);


  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [customer, product] = await Promise.all([
          axios.get("http://localhost:8080/consumer/get", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/stock", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/tax/getalltax", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCustomers(customer.data.consumer)
        setProducts(product.data)

      } catch (error) {
        console.error("Error loading dropdown data", error);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate()


  const postSale = async (e) => {
    e.preventDefault()
    if (formData.total_amount !== 0)
      try {
        const response = await axios.post("http://localhost:8080/sales", formData, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        handleSuccess('Sale posted successfully:')
        navigate('/sell')
        console.log("Sale posted successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error posting sale:", error.response ? error.response.data : error.message);
      }

    else alert("Fill The Required Fields")
  };


  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    invoice_number: `I-${timestamp.toString().slice(-4)}-${randomNum}`,
    sell_no: `S-${timestamp.toString().slice(-4)}-${randomNum}`,
    dispatch_no: `D-${timestamp.toString().slice(-4)}-${randomNum}`,
    products: [],
    customer_no: '',
    customer_name: '',
    customer_address: '',
    customer_contact: '',
    customer_type: '',
    total_amount: 0,
    payment: {}
  })

  const [productData, setProductData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    gstPercent: 0,
    total: 0
  })

  const [grandTotal, setGrandTotal] = useState(0)
  const [paymentData, setPaymentData] = useState({
    status: 'paid',
    paid: '',
    due: '',
    method: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (paymentData.status === "paid") {
      setPaymentData((prev) => ({
        ...prev,
        status: paymentData.status,
        paid: grandTotal,
        due: 0,
      }));
      setIsDueDateDisabled(true);
    } else if (paymentData.status === "unpaid") {
      setPaymentData((prev) => ({
        ...prev,
        status: paymentData.status,
        paid: 0,
        due: grandTotal,
      }));
      setIsDueDateDisabled(false);
    } else if (paymentData.status === "partial") {
      setPaymentData((prev) => ({
        ...prev,
        status: paymentData.status,
        paid: "",
        due: grandTotal,
      }));
      setIsDueDateDisabled(false);
    }
  }, [paymentData.status, grandTotal])



  const calculateSum = () => {
    return formData.products.map((pr) => pr.total).reduce((total, current) => {
      return Number(total) + Number(current);
    }, 0);
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const [isDueDateDisabled, setIsDueDateDisabled] = useState(true);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function calculateTotal() {
    const total = (productData.quantity * productData.unitPrice * (1 + productData.gstPercent / 100)).toFixed(2)
    setProductData({
      ...productData,
      total
    })
    return total;
  }
  useEffect(() => {
    calculateTotal(); calculateSum()
    setGrandTotal(calculateSum())
  }, [productData.quantity, formData.products]);


  useEffect(() => {
    if (paymentData.status === "partial") {
      setPaymentData((prev) => ({
        ...prev,
        due: Math.floor((grandTotal - prev.paid)),
      }));
    }
  }, [paymentData.paid])


  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  function storeProduct(e) {
    e.preventDefault();
    setFormData({
      ...formData,
      products: [...formData.products, productData],
    })
    setpriceList([...priceList, productData.total])
    setProductData(
      {
        name: '',
        category: '',
        quantity: 0,
        unitPrice: 0,
        gstPercent: 0,
        total: 0
      }
    )
  }

  useEffect(() => {

    setFormData((prevData) => ({
      ...prevData,
      payment: paymentData,
      total_amount: grandTotal
    }));
  }, [paymentData])






  console.log('formdata', formData)
  console.log('paymentData', paymentData)


  return (
    <div>
      <div className="ph1 flex items-center justify-between">
        <div className="back_title flex items-center gap-4">
          <Link to={'/sell'}>
            <button className='back-icon cursor-pointer'><GoArrowLeft /></button></Link>
          <h3 style={{ fontSize: "20px" }}>New Sell</h3>
        </div>
        <h3 style={{ fontSize: "18px" }}>Added Product : {formData.products.length}</h3>
      </div>
      <form action="">
        <div className="form1">
          <div className="input-groups">
            <label htmlFor="CustomerName">Customer Name</label>
            <input type="text" id='CustomerName' name='customer_name' onChange={(e) => {
              handleFormChange(e)
              const filtered = customers.filter((supplier) =>
                supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setFiltered(filtered);
              setShowSupplierDropdown(e.target.value.trim() !== "");
            }
            } placeholder='Customer Name'
              value={formData.customer_name}
            />

            {showSupplierDropdown && filtered.length > 0 && (
              <ul className="custom-select-list">
                {filtered.map((customer, idx) => (
                  <li key={idx} onClick={() => {
                    { console.log(customer, 'ccssdd') }
                    setFormData({ ...formData, customer_name: customer.name, customer_type: customer.customerType, customer_no: customer.consumerNo, customer_address: customer.address, customer_contact: customer.contact });
                    setShowSupplierDropdown(false)
                  }}>
                    {customer.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-groups">
            <label htmlFor="productName">Product Name</label>
            <input type="text" id='productName' name='name' placeholder='Product Name'
              value={productData.name}
              onChange={(e) => {
                handleProductChange(e);
                const filtered = products.filter((product) =>
                  product.product_Name.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFiltered(filtered);
                setShowProductDropdown(e.target.value.trim() !== "");
              }}
              required />
            {showProductDropdown && filtered.length > 0 && (
              <ul className="custom-select-list">
                {filtered.map((product, idx) => (
                  <li key={idx} onClick={() => {
                    setProductData({ ...productData, name: product.product_Name, category: product.category_name, quantity: 1, unitPrice: product.sellingPrice, gstPercent: product.tax.taxPer })
                    setShowProductDropdown(false)
                  }}>
                    {product.product_Name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-groups">
            <label htmlFor="unitperprice">Per Unit Price</label>
            <input type="number" value={productData.unitPrice} id='unitperprice' placeholder='Per Unit Price' required />
          </div>
          <div className="input-groups">
            <label htmlFor="unit">No. of Unit</label>
            <input type="number" name='quantity' onChange={(e) => { handleProductChange(e) }} value={productData.quantity} id='unit' placeholder='No. of Unit' required />
          </div>
          <div className="input-groups">
            <label htmlFor="tax">Tax</label>
            <input type="text" id='tax' placeholder='Tax'
              value={productData.gstPercent}
              required />
          </div>
          <div className="input-groups">
            <label htmlFor="totalprice">Total Price</label>
            <input type="number" id='totalprice' placeholder='Total Price' value={productData.total} readOnly required />
          </div>
        </div>
        <button className='bg-[#00006b] text-white p-3 rounded ' onClick={storeProduct}>Add item</button>
      </form >
      {formData.products.length > 0 && <div className="table-container">
        <table className='addpurchse-table' style={{ fontSize: "16px" }}>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Product</th>
              <th>Category</th>
              <th>Units</th>
              <th style={{ minWidth: "100px" }}>Unit Price</th>
              <th style={{ minWidth: "140px" }}>Tax</th>
              <th style={{ minWidth: "100px" }}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.map((item, index) => <tr key={index} >
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{`₹ ${item.unitPrice}`}</td>
              <td>{item.gstPercent} %</td>
              <td>{`₹ ${item.total}`}</td>
            </tr>)}
          </tbody>
        </table>
        <div style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'right', color: "#00006b", }}>
          <p>Grand Total: ₹ {Math.round(grandTotal)}</p>
        </div>
      </div>}
      <form action="">
        <h3 className='mt-6 text-xl' style={{ color: "#00006b" }}>Payment Details</h3>
        <div className="form2">
          <div className="input-groups">
            <label htmlFor="paidStatus">Payment Status</label>
            <select name="status" id="paidStatus" onChange={handlePaymentChange} value={paymentData.status}>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          </div>
          <div className="input-groups">
            <label htmlFor="paidAmount">Paid Amount</label>
            <input type="number" id='paidAmount' placeholder='Paid Amount' name='paid' onChange={handlePaymentChange} value={paymentData.paid !== "" ? Math.round(paymentData.paid) : ""} readOnly={paymentData.status !== "partial"} required />
          </div>
          <div className="input-groups">
            <label htmlFor="dueAmount">Due Amount</label>
            <input type="number" id='dueAmount' placeholder='Due Amount' value={Math.round(paymentData.due)} readOnly required />
          </div>
          <div className="input-groups">
            <label htmlFor="dueDate">Due Date</label>
            <input type="date" name='date' id='dueDate' onChange={handlePaymentChange} value={paymentData.date} disabled={isDueDateDisabled} required />
          </div>

        </div>
        <div className="payment">
          <div className="payment-groups">
            <h3 className='mb-4'>Payment mode</h3>
            <div className="payment-mode">
              <div className="cash">
                <label htmlFor="cash">Cash</label>
                <input type="radio" name="method" id='cash' onChange={handlePaymentChange} value="cash" required />
              </div>
              <div className="cheque">
                <label htmlFor="cheque">Cheque</label>
                <input type="radio" name="method" id='cheque' onChange={handlePaymentChange} value="cheque" required />
              </div>
              <div className="card">
                <label htmlFor="card">Card</label>
                <input type="radio" name="method" id='card' onChange={handlePaymentChange} value="card" required />
              </div>
              <div className="upi">
                <label htmlFor="upi">UPI</label>
                <input type="radio" name="method" id='upi' onChange={handlePaymentChange} value="upi" required />
              </div>
            </div>
          </div>

          <button onClick={postSale} >Sell</button>
        </div>
      </form>
    </div >
  );
};

export default SalesForm;
