import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/authLayout.css";
import "../styles/register.css";
import authImage from "../assets/learnexa-auth.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    alert("Account created successfully! Please login.");
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">

        <div className="auth-left">
          <h1>Start Your Learning Journey</h1>
          <p>
            Join Learnexa today and gain access to high-quality courses,
            progress tracking, and certifications designed to boost
            your career growth.
          </p>
          <img src={authImage} alt="E-learning Platform" />
        </div>

        <div className="auth-right">
          <div className="auth-logo">
  <div className="logo-icon">🎓</div>
  <span className="logo-text">Learnexa</span>
</div>

          <h2>Create your account</h2>
          

          <form onSubmit={submit}>
            <input
              placeholder="Full name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button type="submit">Register</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
