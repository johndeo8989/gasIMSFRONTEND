import React, { useState } from "react";
import "./auth.css";
import axios from "axios";

import gas from "../assets/logingasImage.png";

import { ToastContainer } from "react-toastify";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/utils";

const SignUp = () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  console.log(token, "-------------token0=");
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChage = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [confirmPass, setConfirmPass] = useState("");

  const handleRegisterUser = async (event) => {
    event.preventDefault();
    const { name, email, password } = user;

    if ((!name || !email, !password)) {
      return handleError("All Fields Are Required!");
    } else if (confirmPass !== user.password) {
      return handleError("Password Don't match");
    }

    if (confirmPass === user.password) {
      try {
        const url = "http://localhost:8080/auth/register";
        axios
          .post(url, user)
          .then((response) => {
            const { success, message } = response.data;
            if (success) {
              handleSuccess(message);
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            }
          })
          .catch((error) => handleError(error.response.data.error));
      } catch (error) {
        alert(error);
      }
      console.log("----------------USER---------------", user);
    }
  };

  return (
    <>
      <div className="authContainer h-screen flex flex-col justify-center  items-center  relative ">
        <img src={gas} alt="" className="absolute gasimage end-0" />
        <div className="formCont">
          <div className="authheader">
            <h2>Get Started</h2>
            <p>
              Already have an account? &nbsp;
              <Link to="/login">Login</Link>
            </p>
          </div>
          <div className="authForm">
            <input
              type="text"
              name="name"
              placeholder="Username"
              required
              autoFocus
              value={user.name}
              onChange={handleInputChage}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={user.email}
              onChange={handleInputChage}
            />

            <input
              type="password"
              name="password"
              value={user.password}
              placeholder="Password"
              required
              onChange={handleInputChage}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <button onClick={handleRegisterUser}>Sign Up</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
