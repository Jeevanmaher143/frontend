import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin/dashboard", name: "डॅशबोर्ड" },
    { path: "/admin/notices", name: "सूचना" },
    { path: "/admin/services", name: "सेवा" },
    { path: "/admin/schemes", name: "योजना" },
    { path: "/admin/development", name: "विकास कामे" },
    { path: "/admin/gallery", name: "छायाचित्रे" },
    // { path: "/admin/complaints", name: "तक्रारी" },
    { path: "/admin/contact", name: "सदस्य" },
    { path: "/admin/about", name: "गावाची माहिती" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("आपण लॉगआउट करणार आहात का?")) {
      navigate("/login");
    }
  };

  return (
    <div className="admin-container">
      {/* LEFT SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="admin-header">
          <div className="admin-logo">
            <div className="logo-icon">GP</div>
            <div className="logo-text">
              <h2>ग्राम पंचायत</h2>
              <p>प्रशासन पॅनल</p>
            </div>
          </div>
        </div>

        <div className="admin-profile">
          <div className="profile-avatar">
            <span className="g1name">G1</span>
          </div>
          <div className="profile-info">
            <h3>मुख्य प्रशासक</h3>
            <span className="profile-badge">Jeevan Maher</span>
          </div>
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
              {isActive(item.path) && (
                <span className="active-indicator"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="admin-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span>लॉगआउट</span>
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="admin-content">
        <div className="content-header">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>

          <div className="breadcrumb">
            <span className="breadcrumb-home">मुख्यपृष्ठ</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {menuItems.find(
                (item) => item.path === location.pathname
              )?.name || "डॅशबोर्ड"}
            </span>
          </div>
        </div>

        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
