import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils/utils";
import axios from "axios";

const Homepage = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [role, setRole] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setLoggedInUser(userData?.name || "User");
    setRole(userData?.role || "Guest");
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    handleSuccess("User Logged Out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  const fetchProduct = async () => {
    try {
      const headers = {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("userData")).jwtToken,
        },
      };
      const fetched = await axios.get(
        "http://localhost:8080/products",
        headers
      );
      setProducts(fetched.data);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-6">
        <h1 className="font-bold text-4xl">
          {loggedInUser} is {role.toUpperCase()}
        </h1>
        <h2 className="text-2xl font-semibold">Welcome to the Homepage</h2>
        <p className="text-lg">This is the main page of your application.</p>

        <div className="bg-white p-8 rounded-lg shadow-lg text-black space-y-6 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-center">Product List</h3>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={index}
                  className="border-b border-gray-300 pb-2 flex justify-between"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-600">${product.price}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No products available.</p>
            )}
          </div>

          
        </div>

        <button
          className="bg-pink-600 text-white py-2 px-6 rounded mt-5 hover:bg-pink-700 transition"
          onClick={handleLogout}
        >
          LOGOUT USER
        </button>
      </div>
    </div>
  );
};

export default Homepage;
