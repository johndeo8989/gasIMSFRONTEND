import React, { useState } from "react";
import "./auth.css";
import { handleError, handleSuccess } from "../utils/utils";

import gas from "../assets/logingasImage.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
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

  const handleloginUser = async (event) => {
        event.preventDefault()
        const { email, password } = user;

        if (!email || !password) {
            return handleError('All Fields Are Required!')
        }


        try {
            const url = 'http://localhost:8080/auth/login';
            axios.post(url, user).then(response => {
                const { success, message, jwtToken } = response.data
                if (success) {
                    handleSuccess(message)
                    localStorage.setItem('token', jwtToken);
                    console.log(response.data);
                    localStorage.setItem("userData", JSON.stringify(response.data)); 
                    setTimeout(() => {
                        navigate('/home')
                    }, 1000);
                }
            })
        } catch (error) {
            alert(error)
        }
        console.log('----------------USER---------------', user)

  };

  return (
    <>
      <div className="authContainer h-screen flex flex-col justify-center items-center relative">
        <img src={gas} alt="" className="absolute gasimage end-0" />

        <div className="formCont">
          <div className="authheader">
            <h2>Welcome Back</h2>
            <p>
              Don't have an account? &nbsp;
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
          <div className="authForm">
            <input
              onChange={handleInputChage}
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <input
              onChange={handleInputChage}
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <button onClick={handleloginUser} type="submit">
              Login
            </button>
          </div>

          <div className="authheader mt-5">
            <Link className="" to="/forget-password">
              Forget Password
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
