import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Progress from "./components/dashboard/Progress";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import Certificates from "./components/dashboard/Certificates";
import AdminDashboard from "./components/admin/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />

<Route
  path="/courses"
  element={
    <ProtectedRoute>
      <CourseList />
    </ProtectedRoute>
  }
/>

 <Route
  path="/course/:id"
  element={
    <ProtectedRoute>
      <CourseDetail />
    </ProtectedRoute>
  }
/>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
