import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../assets/egram-logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  // Helper function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              <img
                src={logo}
                alt="ई-ग्राम पंचायत लोगो"
                className="brand-logo"
              />
            </Link>

            {/* DESKTOP MENU */}
            <div className="nav-desktop-menu">
              <Link 
                to="/" 
                className={isActive("/") ? "active" : ""}
              >
                मुख्यपृष्ठ
              </Link>
              <Link 
                to="/notices" 
                className={isActive("/notices") ? "active" : ""}
              >
                सूचना
              </Link>
              <Link 
                to="/services" 
                className={isActive("/services") ? "active" : ""}
              >
                सेवा
              </Link>
              <Link 
                to="/schemes" 
                className={isActive("/schemes") ? "active" : ""}
              >
                योजना
              </Link>
              
              <Link 
                to="/development" 
                className={isActive("/development") ? "active" : ""}
              >
                विकास कामे
              </Link>
              <Link 
                to="/gallery" 
                className={isActive("/gallery") ? "active" : ""}
              >
                छायाचित्रे
              </Link>
              <Link 
                to="/about" 
                className={isActive("/about") ? "active" : ""}
              >
                गावाची माहिती
              </Link>
              <Link 
                to="/contact" 
                className={isActive("/contact") ? "active" : ""}
              >
                सदस्य
              </Link>

              {!user && (
                <Link to="/login" className="login-button">
                  <span>लॉगिन</span>
                </Link>
              )}

              {user && (
                <button
                  className="profile-avatar-vertical"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="प्रोफाइल"
                  />
                  <span className="profile-name">{user.fullName}</span>
                </button>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <div className="nav-mobile-button">
              <button
                className="nav-toggle-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "बंद करा" : "मेनू उघडा"}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && <div className="mobile-overlay" onClick={closeMenu} />}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="nav-mobile-menu-wrapper">
          {/* PROFILE FIRST */}
          {user ? (
            <button
              className="mobile-profile-btn"
              onClick={() => {
                navigate("/profile");
                closeMenu();
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="प्रोफाइल"
                className="mobile-profile-avatar"
              />
              <span>स्वागत आहे, {user.fullName}</span>
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={closeMenu}
              className={isActive("/login") ? "active" : ""}
            >
              लॉगिन
            </Link>
          )}

          {/* MENU ITEMS */}
          <Link 
            to="/" 
            onClick={closeMenu}
            className={isActive("/") ? "active" : ""}
          >
            मुख्यपृष्ठ
          </Link>
          <Link 
            to="/about" 
            onClick={closeMenu}
            className={isActive("/about") ? "active" : ""}
          >
            गावाची माहिती
          </Link>
          <Link 
            to="/services" 
            onClick={closeMenu}
            className={isActive("/services") ? "active" : ""}
          >
            सेवा
          </Link>
          <Link 
            to="/schemes" 
            onClick={closeMenu}
            className={isActive("/schemes") ? "active" : ""}
          >
            योजना
          </Link>
          <Link 
            to="/notices" 
            onClick={closeMenu}
            className={isActive("/notices") ? "active" : ""}
          >
            सूचना
          </Link>
          <Link 
            to="/development" 
            onClick={closeMenu}
            className={isActive("/development") ? "active" : ""}
          >
            विकास कामे
          </Link>
          <Link 
            to="/gallery" 
            onClick={closeMenu}
            className={isActive("/gallery") ? "active" : ""}
          >
            छायाचित्रे
          </Link>
          <Link 
            to="/contact" 
            onClick={closeMenu}
            className={isActive("/contact") ? "active" : ""}
          >
            सदस्य
          </Link>

          {/* LOGOUT */}
          {user && (
            <button
              onClick={handleLogout}
              className="mobile-logout-button"
            >
              लॉगआउट
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;