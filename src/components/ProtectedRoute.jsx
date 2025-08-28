import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">⏳ Checking auth...</div>;
  }

  // 🚫 Agar login hi nahi hai → login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Agar /admin route hai aur admin nahi hai → home bhej do
  if (location.pathname.startsWith("/admin") && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🚫 Agar specific role diya gaya hai aur match nahi ho raha
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
