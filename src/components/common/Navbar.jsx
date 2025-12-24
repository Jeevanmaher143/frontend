import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../assets/egram-logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = user?.fullName?.split(" ")[0];

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="E Gram Panchayat Logo" className="brand-logo" />
            </Link>

            <div className="nav-desktop-menu">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/schemes">Schemes</Link>
              <Link to="/notices">Notices</Link>
              <Link to="/development">Development</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Members</Link>

              {!user && <Link to="/login" className="login-button">Login</Link>}
              {user && (
                <button className="profile-avatar vertical" onClick={() => navigate("/profile")}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile" />
                  <span className="profile-name">{firstName}</span>
                </button>
              )}
            </div>

            <div className="nav-mobile-button">
              <button className="nav-toggle-button" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && <div className="mobile-overlay" onClick={closeMenu} />}

      {menuOpen && (
        <div className="nav-mobile-menu-wrapper">
          {/* PROFILE SECTION FIRST */}
          {user ? (
            <>
              <button className="mobile-profile-btn" onClick={() => { navigate("/profile"); closeMenu(); }}>
                 Welcome {firstName}
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}> Login</Link>
          )}

          {/* THEN NAV ITEMS */}
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/schemes" onClick={closeMenu}>Schemes</Link>
          <Link to="/notices" onClick={closeMenu}>Notices</Link>
          <Link to="/development" onClick={closeMenu}>Development</Link>
          <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
          <Link to="/contact" onClick={closeMenu}>Members</Link>

          {/* LOGOUT AT BOTTOM */}
          {user && (
            <button onClick={handleLogout} className="mobile-logout-button">
               Logout
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;