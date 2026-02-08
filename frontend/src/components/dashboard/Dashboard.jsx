import Sidebar from "./Sidebar";
import StatsCard from "./StatsCard";
import { useEffect, useState } from "react";
import API from "../../api/api";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "./Dashboard.css";

const COLORS = ["#16a34a", "#10b981", "#34d399"];
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Refresh stats every 5 seconds
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatLearningTime = (hours) => {
    if (hours === undefined || hours === null) return "0.00 hrs";
    return `${Number(hours).toFixed(2)} hrs`;
  };

  const insightsData = stats?.learningInsights ? stats.learningInsights : [];

if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <h1>Welcome back 👋</h1>
        <p className="subtitle">Track your learning progress</p>

        <div className="stats-grid">
          <StatsCard title="Total Learners" value={stats?.totalLearners} />

         <StatsCard title="Courses Enrolled" value={stats?.totalCourses} />
         <StatsCard title="Learning Time" value={formatLearningTime(stats?.learningTime)} />

        </div>

        <div className="charts">
          {/* PIE CHART */}
          <div className="chart-card">
            <h3>Course Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.courseBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {stats.courseBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LINE CHART */}
          <div className="chart-card">
            <h3>Learning Insights</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={insightsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(3)} hrs`, 'Hours']} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
