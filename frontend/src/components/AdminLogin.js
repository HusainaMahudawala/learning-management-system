import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/authLayout.css";
import "../styles/adminLogin.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      const user = res.data.user;

      if (user.role !== "admin") {
        setError("Access Denied: Admin account required");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-bg admin-bg">
      <div className="auth-card admin-card">
        {/* LEFT SIDE */}
        <div className="auth-left admin-left">
          <h1>Admin Portal</h1>
          <p>
            Manage courses, track student progress, and oversee the learning
            platform. Access powerful tools to create engaging educational
            content and monitor student engagement metrics.
          </p>
          <div className="admin-features">
            <div className="feature-item">✓ Create & Manage Courses</div>
            <div className="feature-item">✓ Track Student Progress</div>
            <div className="feature-item">✓ View Learning Analytics</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right admin-right">
          <div className="auth-logo admin-logo">
            <div className="logo-icon">👨‍💼</div>
            <span className="logo-text">Admin Console</span>
          </div>

          <h2>Sign in to admin account</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={submit}>
            <input
              type="email"
              placeholder="Admin email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button type="submit">Sign In as Admin</button>
          </form>

          <p className="auth-switch">
            Not an admin? <Link to="/login">Sign in as Student</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
