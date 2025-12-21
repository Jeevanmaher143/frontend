import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../assets/egram-logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = user?.fullName?.split(" ")[0];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">

          {/* BRAND */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="E Gram Panchayat Logo" className="brand-logo" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="nav-desktop-menu">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/schemes">Schemes</Link>
            <Link to="/notices">Notices</Link>
            <Link to="/development">Development</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Members</Link>

            {!user && (
              <Link to="/login" className="login-button">Login</Link>
            )}

            {user && (
              <button
                className="profile-avatar vertical"
                onClick={() => navigate("/profile")}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Profile"
                />
                <span className="profile-name">{firstName}</span>
              </button>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="nav-mobile-button">
            <button
              className="nav-toggle-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="nav-mobile-menu-wrapper">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/schemes" onClick={() => setMenuOpen(false)}>Schemes</Link>
          <Link to="/notices" onClick={() => setMenuOpen(false)}>Notices</Link>
          <Link to="/development" onClick={() => setMenuOpen(false)}>Development</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Members</Link>

          {!user && <Link to="/login">Login</Link>}

          {user && (
            <>
              <button
                className="mobile-profile-btn"
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
              >
                👤 My Profile
              </button>

              <button
                onClick={handleLogout}
                className="mobile-logout-button"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
