import { useState, useEffect } from "react";
import API from "../../api/api";
import "./AdminUserDetail.css";

export default function AdminUserDetail({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users/${userId}`);
      setUser(res.data.user);
      setEnrollments(res.data.enrollments);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="user-detail-container">
      <button className="btn-back" onClick={onBack}>
        ← Back
      </button>

      <div className="user-info">
        <h2>{user.name}</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> <span className={`role-badge ${user.role}`}>{user.role}</span>
        </p>
      </div>

      <div className="enrollments-section">
        <h3>Enrollments ({enrollments.length})</h3>
        {enrollments.length === 0 ? (
          <p>No enrollments yet.</p>
        ) : (
          <table className="enrollments-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Progress</th>
                <th>Learning Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id}>
                  <td>{e.course?.title || "Unknown"}</td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${e.progress}%` }}
                      ></div>
                      <span>{e.progress}%</span>
                    </div>
                  </td>
                  <td>{e.learningHours.toFixed(2)} hrs</td>
                  <td>
                    <span className={e.completed ? "status-completed" : "status-ongoing"}>
                      {e.completed ? "✅ Completed" : "🔄 In Progress"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
