import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminCreateCourse from "./AdminCreateCourse";
import AdminUsers from "./AdminUsers";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <nav className="admin-nav">
          <button
            className={`nav-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            Create Course
          </button>
          <button
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Track Users
          </button>
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
          {/* Back to Dashboard removed for admin-only flow */}
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === "courses" && <AdminCreateCourse />}
        {activeTab === "users" && <AdminUsers />}
      </div>
    </div>
  );
}
