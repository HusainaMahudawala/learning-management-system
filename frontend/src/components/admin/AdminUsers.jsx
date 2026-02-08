import { useState, useEffect } from "react";
import API from "../../api/api";
import "./AdminUsers.css";
import AdminUserDetail from "./AdminUserDetail";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedUser) {
    return <AdminUserDetail userId={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-users-container">
      <h2>Track Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Courses Enrolled</th>
              <th>Total Learning Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>{user.coursesEnrolled}</td>
                <td>{user.totalLearningHours.toFixed(2)}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedUser(user.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
