import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        noticesRes,
        servicesRes,
        schemesRes,
        complaintsRes
      ] = await Promise.all([
        axios.get(`${API_BASE}/api/notices`),
        axios.get(`${API_BASE}/api/admin/services`),
        axios.get(`${API_BASE}/api/schemes`),
        axios.get(`${API_BASE}/api/contacts`)
      ]);

      setStats([
        { label: "Total Notices", value: noticesRes.data.length },
        { label: "Active Services", value: servicesRes.data.length },
        { label: "Schemes", value: schemesRes.data.length },
        { label: "Members", value: complaintsRes.data.length }
      ]);

      const activities = noticesRes.data
        .slice(0, 5)
        .map(n => ({
          action: `Notice added: ${n.title}`,
          time: new Date(n.createdAt).toLocaleString(),
          type: "notice"
        }));

      setRecentActivities(activities);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <div className="welcome-content">
          <h1 className="welcome-title">
            {getGreeting()}, Administrator
          </h1>
          <p className="welcome-subtitle">
            Welcome back to your Gram Panchayat Admin Dashboard
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-details">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Recent Activities</h2>
        </div>

        {recentActivities.length === 0 ? (
          <div className="empty-state">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
