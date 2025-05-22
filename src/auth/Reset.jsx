import React, { useState } from 'react';
import './auth.css';
import { handleError, handleSuccess } from '../utils/utils';
import gas from '../assets/logingasImage.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Reset = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState({
        'newPassword': '',
        'confirmPassword': ''
    });

    console.log(password)

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPassword({
            ...password,
            [name]: value
        });
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        const { newPassword, confirmPassword } = password;

        if (!newPassword || !confirmPassword) {
            return handleError('All Fields Are Required!');
        }

        if (newPassword !== confirmPassword) {
            return handleError('Passwords do not match!');
        }
        try {
            const url = `http://localhost:8080/auth/reset-password/${token}`;
            axios.post(url, { 'password': newPassword }).then(response => {
                console.log(response)
                const { success, message } = response.data;
                if (success) {
                    handleSuccess(message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            }).catch(error => handleError(error.response.data.error));
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div className="authContainer h-screen flex flex-col justify-center items-center relative">
                <img src={gas} alt="" className='absolute gasimage end-0' />
                <div className="formCont">

                    <div className="authheader">
                        <h2>Reset Password</h2>
                        <p>Please enter your new password below.</p>
                    </div>

                    <div className="authForm">
                        <input value={password.newPassword} onChange={handleInputChange} name='newPassword' type="password" placeholder="New Password" required />
                        <input value={password.confirmPassword} onChange={handleInputChange} name='confirmPassword' type="password" placeholder="Confirm New Password" required />
                        <button onClick={handleResetPassword} type="submit">Set New Password</button>
                    </div>
                    <div className="authheader mt-5">
                        <Link className='' to="/login">Back to login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reset;