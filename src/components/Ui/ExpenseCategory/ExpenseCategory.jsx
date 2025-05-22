import React, { useState } from "react";
import "./ExpenseCategory.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { IoIosClose } from "react-icons/io";
function ExpenseCategory({ setCategoryVisible }) {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("");

    return (
        <div>
            <aside>
                <p className="font-bold">Expense Category </p>
                <IoIosClose className="text-red-600 block lg:hidden text-3xl font-bold absolute top-0 right-0 " onClick={() => setCategoryVisible(false)} />
                <NavLink
                    to="/expense/overview"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Overview
                </NavLink>
                <NavLink
                    to="/expense/salary"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Salary
                </NavLink>
                <NavLink
                    to="/expense/transport"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Transportation Costs
                </NavLink>

                <NavLink
                    to="/expense/maintenance"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Maintenance Repairs
                </NavLink>
                <NavLink
                    to="/expense/rent"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Rent
                </NavLink>
                <NavLink
                    to="/expense/marketing"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Marketing and Advertising
                </NavLink>

                <NavLink
                    to="/expense/stationary"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Stationary
                </NavLink>
                <NavLink
                    to="/expense/utility"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Utility Bills
                </NavLink>

                <NavLink
                    to="/expense/pattybills"
                    style={({ isActive }) => ({ background: isActive ? "#00006B" : "", color: isActive ? 'white' : '' })}
                >
                    Patty Bills
                </NavLink>
            </aside>
        </div >
    );
}

export default ExpenseCategory;
