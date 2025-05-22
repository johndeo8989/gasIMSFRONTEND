// routes/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  return token?.jwtToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
