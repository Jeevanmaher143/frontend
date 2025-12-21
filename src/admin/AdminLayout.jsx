import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard" },
    { path: "/admin/notices", name: "Notices" },
    { path: "/admin/services", name: "Services" },
    { path: "/admin/schemes", name: "Schemes" },
    { path: "/admin/development", name: "Development" },
    { path: "/admin/gallery", name: "Gallery" },
    { path: "/admin/complaints", name: "Complaints" },
    { path: "/admin/contact", name: "Member" },
    { path: "/admin/about", name: "About Village" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
    }
  };

  return (
    <div className="admin-container">
      {/* LEFT SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-header">
          <div className="admin-logo">
            <div className="logo-icon">GP</div>
            <div className="logo-text">
              <h2>Gram Panchayat</h2>
              <p>Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="admin-profile">
          <div className="profile-avatar">
            <span className="g1name">G1 </span>
          </div>
          <div className="profile-info">
            <h3>Super Admin</h3>
            <span className="profile-badge">Jeevan Maher</span>
          </div>
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
              {isActive(item.path) && <span className="active-indicator"></span>}
            </Link>
          ))}
        </nav>

        <div className="admin-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
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
            <span className="breadcrumb-home">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
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