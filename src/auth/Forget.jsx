import React, { useState } from 'react'
import './auth.css'
import { handleError, handleSuccess } from '../utils/utils'
import gas from '../assets/logingasImage.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
const Forget = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email) {
            return handleError('All Fields Are Required!')
        }
        try {
            const url = 'http://localhost:8080/auth/forget-password';
            axios.post(url, { email }).then(response => {
                const { success, message } = response.data
                if (success) {
                    handleSuccess(message)
                    setTimeout(() => {
                        navigate('/login')
                    }, 1000);
                }
            }).catch(error => handleError(error.response.data.error))

        } catch (error) {
            alert(error)
        }
        console.log('----------------USER---------------', email)
    }
    return (
        <>
            <div className="authContainer h-screen flex flex-col justify-center items-center relative">
                <img src={gas} alt="" className='absolute gasimage end-0' />
                <div className="formCont">
                    <div className="authheader">
                        <h2>Forgot Password?</h2>
                        <p>No worries, we will send you reset instructions.
                        </p>
                    </div>
                    <div className="authForm">
                        <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" placeholder="Enter Your Registered Email" required />
                        <button onClick={handleSubmit} type="submit">Send Reset Link</button>
                    </div>
                    <div className="authheader mt-5">
                        <Link className='' to="/login">Back to login</Link>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Forget
