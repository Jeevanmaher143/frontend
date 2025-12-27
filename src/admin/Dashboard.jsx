import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const API_BASE =
  process.env.REACT_APP_API_URL || "https://backend-9i6n.onrender.com";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // ✅ ADMIN TOKEN

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "सुप्रभात";
    if (hour < 18) return "नमस्कार";
    return "शुभ संध्या";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ PUBLIC APIs
      const noticesRes = await axios.get(`${API_BASE}/api/notices`);
      const schemesRes = await axios.get(`${API_BASE}/api/schemes`);
      const membersRes = await axios.get(`${API_BASE}/api/contacts`);
      const devlopmentcount = await axios.get(`${API_BASE}/api/development`);

      // ✅ ADMIN API (WITH TOKEN)
      let servicesCount = 0;
      try {
        const servicesRes = await axios.get(
          `${API_BASE}/api/admin/services`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        servicesCount = servicesRes.data.length;
      } catch (err) {
        console.warn("Admin services access denied");
      }

      // ✅ SET STATS
      setStats([
        { label: "एकूण सूचना", value: noticesRes.data.length },
        {label : "विकास कामे ", value:devlopmentcount.data.length},
        { label: "शासकीय योजना", value: schemesRes.data.length },
        { label: "सदस्य", value: membersRes.data.length },
        { label: "सेवा अर्ज", value: servicesCount },
      ]);

      // ✅ RECENT ACTIVITIES
      const activities = noticesRes.data
        .slice(0, 5)
        .map((n) => ({
          action: `सूचना जोडली: ${n.title}`,
          time: new Date(n.createdAt).toLocaleString(),
        }));

      setRecentActivities(activities);
    } catch (error) {
      console.error("Dashboard fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">डॅशबोर्ड लोड होत आहे...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* WELCOME */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h1 className="welcome-title">
            {getGreeting()}, प्रशासक
          </h1>
          <p className="welcome-subtitle">
            ग्राम पंचायत प्रशासन डॅशबोर्डमध्ये आपले स्वागत आहे
          </p>
        </div>
      </div>

      {/* STATS */}
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

      {/* RECENT ACTIVITIES */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">अलीकडील घडामोडी</h2>
        </div>

        {recentActivities.length === 0 ? (
          <div className="empty-state">
            <p>कोणतीही अलीकडील माहिती उपलब्ध नाही</p>
          </div>
        ) : (
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <p className="activity-action">
                    {activity.action}
                  </p>
                  <span className="activity-time">
                    {activity.time}
                  </span>
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
