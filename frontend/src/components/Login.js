import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/authLayout.css";
import "../styles/login.css";
import authImage from "../assets/learnexa-auth.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      const user = res.data.user;

      // Validate selected role matches server role
      if (form.role && form.role !== user.role) {
        setError("Access Denied: selected role does not match account role");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on actual server role
      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>Learn Smarter. Grow Faster.</h1>
          <p>
            Learnexa is a modern learning platform designed to help
            students master new skills, track progress, and achieve
            career goals through structured courses.
          </p>
          <img src={authImage} alt="Online Learning" />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-logo">
  <div className="logo-icon">🎓</div>
  <span className="logo-text">Learnexa</span>
</div>

          <h2>Sign in to your account</h2>

          {error && <div className="error-message" style={{ background: '#fed7d7', color: '#742a2a', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontWeight: 500, borderLeft: '4px solid #f56565' }}>{error}</div>}

          <form onSubmit={submit}>
            <input
              type="email"
              placeholder="Email address"
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

            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ padding: 8, borderRadius: 6 }}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <p className="auth-switch">
            New to Learnexa? <Link to="/register">Create an account</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
