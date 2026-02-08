import "./Dashboard.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Learnexa</h2>

      <ul className="menu">
        <li><Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link></li>
        <li><Link to="/courses" className={isActive("/courses")}>Courses</Link></li>
        <li><Link to="/progress" className={isActive("/progress")}>Progress</Link></li>
        <li><Link to="/certificates" className={isActive("/certificates")}>Certificates</Link></li>
        {user?.role === "admin" && (
          <li><Link to="/admin" className={isActive("/admin")} style={{ color: '#f5a623', fontWeight: 600 }}>⚙️ Admin Panel</Link></li>
        )}
      </ul>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <p className="user-name">{user?.name || "User"}</p>
            <p className="user-email">{user?.email || "user@example.com"}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
