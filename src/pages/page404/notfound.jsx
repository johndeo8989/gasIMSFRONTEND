import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="mt-4 text-xl text-gray-600">
                    Oops! The page you are looking for does not exist.
                </p>
                <Link
                    to="/home"
                    className="mt-6 inline-block px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;