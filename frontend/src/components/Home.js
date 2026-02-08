import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to Learnexa</h1>
          <p>A comprehensive learning management system for students and educators</p>
        </div>
      </div>

      <div className="home-cards">
        {/* Student Card */}
        <div className="auth-card-choice student-card">
          <div className="card-icon">👨‍🎓</div>
          <h2>Student</h2>
          <p>
            Access courses, track your learning progress, and earn certificates
            as you complete courses.
          </p>
          <ul className="features-list">
            <li>✓ Browse Available Courses</li>
            <li>✓ Track Learning Progress</li>
            <li>✓ Earn Certificates</li>
            <li>✓ View Analytics</li>
          </ul>
          <Link to="/login" className="btn btn-student">
            Student Login
          </Link>
        </div>

        {/* Admin Card */}
        <div className="auth-card-choice admin-card">
          <div className="card-icon">👨‍💼</div>
          <h2>Administrator</h2>
          <p>
            Create and manage courses, monitor student progress, and generate
            learning analytics.
          </p>
          <ul className="features-list">
            <li>✓ Create Courses</li>
            <li>✓ Track Students</li>
            <li>✓ Manage Content</li>
            <li>✓ View Analytics</li>
          </ul>
          <Link to="/admin-login" className="btn btn-admin">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
