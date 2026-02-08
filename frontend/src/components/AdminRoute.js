import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isAdmin = decoded.role === "admin";

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (err) {
    console.error("Token decode error:", err);
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
