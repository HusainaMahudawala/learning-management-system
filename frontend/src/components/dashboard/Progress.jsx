import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Progress.css";
import API from "../../api/api";

export default function Progress() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        // Fetch all enrollments with progress
        const res = await API.get("/enrollments");
        setEnrollments(res.data);

        // Fetch dashboard stats for overview
        const statsRes = await API.get("/dashboard/stats");
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const formatLearningTime = (hours) => {
    if (hours === undefined || hours === null) return "0.00 hrs";
    return `${Number(hours).toFixed(2)} hrs`;
  };

  const formatSecondsToLabel = (seconds) => {
    if (!seconds) return "0.00 hrs";
    const hours = seconds / 3600;
    return `${Number(hours).toFixed(2)} hrs`;
  };

  if (loading) return <div className="progress-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="progress-container">
        <h1>📊 Your Learning Progress</h1>

        {/* Overall Stats */}
        {stats && (
          <div className="progress-overview">
            <div className="stat-card">
              <h3>Total Courses Enrolled</h3>
              <p className="stat-value">{stats.totalCourses}</p>
            </div>
            <div className="stat-card">
              <h3>Total Learning Time</h3>
              <p className="stat-value">{formatLearningTime(stats.learningTime)}</p>
            </div>
            <div className="stat-card">
              <h3>Courses Completed</h3>
              <p className="stat-value">
                {enrollments.filter((e) => e.completed).length}
              </p>
            </div>
            <div className="stat-card">
              <h3>Average Progress</h3>
              <p className="stat-value">
                {enrollments.length > 0
                  ? Math.round(
                      enrollments.reduce((sum, e) => sum + e.progress, 0) /
                        enrollments.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        )}

        {/* Detailed Progress List */}
        <div className="progress-list">
          <h2>Course Progress Details</h2>

          {enrollments.length === 0 ? (
            <p className="no-courses">
              You haven't enrolled in any courses yet.
            </p>
          ) : (
            <div className="courses-grid">
              {enrollments.map((enrollment) => (
                <div key={enrollment._id} className="course-progress-card">
                  <div className="card-header">
                    <h3>{enrollment.courseId?.title || "Course"}</h3>
                    <span
                      className={`status-badge ${
                        enrollment.completed ? "completed" : "in-progress"
                      }`}
                    >
                      {enrollment.completed ? "✅ Completed" : "🔄 In Progress"}
                    </span>
                  </div>

                  <div className="progress-details">
                    <div className="progress-info">
                      <span>Progress</span>
                      <span className="progress-percent">
                        {enrollment.progress}%
                      </span>
                    </div>

                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>

                    <div className="stats-row">
                      <div className="stat">
                        <span>Learning Time</span>
                        <span className="value">
                          {formatSecondsToLabel(enrollment.learningTime || 0)}
                        </span>
                      </div>
                      <div className="stat">
                        <span>Lessons Completed</span>
                        <span className="value">
                          {enrollment.completedLessons?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="stats-row">
                      <div className="stat">
                        <span>Started</span>
                        <span className="value">
                          {new Date(enrollment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="stat">
                        <span>Last Active</span>
                        <span className="value">
                          {new Date(enrollment.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    {enrollment.completed ? (
                      <button className="btn-completed" disabled>
                        ✅ Course Completed
                      </button>
                    ) : (
                      <a
                        href={`/course/${enrollment.courseId?._id}`}
                        className="btn-continue"
                      >
                        Continue Learning
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Chart Summary */}
        <div className="progress-summary">
          <h2>Summary</h2>
          <div className="summary-items">
            <div className="summary-item">
              <div className="circle-progress" data-percentage="75">
                <svg viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="bg-circle"
                  ></circle>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="progress-circle"
                    style={{
                      strokeDashoffset: `${282.7 * (1 - 0.75)}`,
                    }}
                  ></circle>
                </svg>
                <div className="circle-text">
                  <span className="percentage">75%</span>
                  <span className="label">Overall</span>
                </div>
              </div>
              <p>You're making great progress! Keep going! 🎯</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
