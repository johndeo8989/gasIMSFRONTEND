import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../pages/page404/notfound";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import Layout from "../components/layout/Layout";
import Homepage from "../pages/HomePage/Homepage";
import ProtectedRoute from "../utils/ProtectedRoute";
import PublicRoute from "../utils/PublicRoute";
import Forget from "../auth/Forget";
import Reset from "../auth/Reset";

import Profile from "../pages/profile/Profile";
import Supplier from "../pages/supplier/supplier";
import Customer from "../pages/customer/customer";
import Product from "../pages/product/product";
import HSN from "../pages/HSN/HSN";
import Category from "../pages/category/Category";
import ExpenseOverview from '../pages/Expense/ExpenseOverview';
import Salary from '../pages/Expense/Salary';
import Transport from '../pages/Expense/Transport';
import Maintainance from '../pages/Expense/Maintainance';
import Tax from "../pages/tax/tax";
import Rent from "../pages/Expense/Rent";
import Marketing from '../pages/Expense/Marketing'
import Stationary from "../pages/Expense/Stationary";
import Utility from "../pages/Expense/Utility";
import PattyBills from "../pages/Expense/PattyBills";
import Vendor from "../pages/vendors/vendors";
import AddConsumer from "../components/Ui/form/ConsumerForm";
import UpdateConsumerForm from "../components/Ui/form/UpdateConsumerForm";
import ProfitPage from "../pages/Profit/ProfitPage";
import Sells from "../pages/Sells/Sells";
import Employee from "../pages/Employee/Employee";
import SalesHistory from "../pages/Sells/SalesHistory";
import SalesForm from "../components/salesForm/salesForm";
import PurchaseForm from "c:/Users/dell/Downloads/gas16may/gas16may/frontend/src/pages/PurchaseForm/PurchaseForm";
import PurchaseDetails from "../pages/purchase/PurchaseDetails";
import Stock from "../pages/stock/Stock";
const AppRouter = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Route  */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forget-password" element={<Forget />} />
            <Route path="/reset-password/:token" element={<Reset />} />
          </Route>
          {/* PROTECTED ROUTE */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/tax" element={<Tax />} />
              <Route path="/product" element={<Product />} />
              <Route path="/hsn" element={<HSN />} />
              <Route path="/category" element={<Category />} />

              <Route path="/home" element={<Homepage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/vendors" element={<Vendor />} />
              <Route path="employee" element={<Employee />} />
              <Route path="/updatecustomer/:id" element={<UpdateConsumerForm />} />
              <Route path="/addcustomer" element={<AddConsumer />} />
              <Route path='/expense/overview' element={<ExpenseOverview />} />
              <Route path='/expense/salary' element={<Salary />} />
              <Route path='/expense/transport' element={<Transport />} />
              <Route path='/expense/maintenance' element={<Maintainance />} />
              <Route path='/expense/rent' element={<Rent />} />
              <Route path='/expense/marketing' element={<Marketing />} />
              <Route path='/expense/stationary' element={<Stationary />} />
              <Route path='/expense/utility' element={<Utility />} />
              <Route path='/expense/pattybills' element={<PattyBills />} />
              <Route path="/profit" element={<ProfitPage />} />
              <Route path="/sell" element={<Sells />} />
              <Route path="/sellHistory" element={<SalesHistory />} />
              <Route path="/sellForm" element={<SalesForm />} />
              <Route path="/addPurchase" element={<PurchaseForm />} />
              <Route path="/purchase" element={<PurchaseDetails />} />
              <Route path="/stock" element={<Stock />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
