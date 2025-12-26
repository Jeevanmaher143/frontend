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
              <Link to="/">मुख्यपृष्ठ</Link>
              <Link to="/about">गावाची माहिती</Link>
              <Link to="/services">सेवा</Link>
              <Link to="/schemes">योजना</Link>
              <Link to="/notices">सूचना</Link>
              <Link to="/development">विकास कामे</Link>
              <Link to="/gallery">छायाचित्रे</Link>
              <Link to="/contact">सदस्य</Link>

              {!user && (
                <Link to="/login" className="login-button">
                  लॉगिन
                </Link>
              )}

              {user && (
                <button
                  className="profile-avatar vertical"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="प्रोफाइल"
                  />
                  <span className="profile-name">{firstName}</span>
                </button>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <div className="nav-mobile-button">
              <button
                className="nav-toggle-button"
                onClick={() => setMenuOpen(!menuOpen)}
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
              स्वागत आहे {firstName}
            </button>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              लॉगिन
            </Link>
          )}

          {/* MENU ITEMS */}
          <Link to="/" onClick={closeMenu}>मुख्यपृष्ठ</Link>
          <Link to="/about" onClick={closeMenu}>गावाची माहिती</Link>
          <Link to="/services" onClick={closeMenu}>सेवा</Link>
          <Link to="/schemes" onClick={closeMenu}>योजना</Link>
          <Link to="/notices" onClick={closeMenu}>सूचना</Link>
          <Link to="/development" onClick={closeMenu}>विकास कामे</Link>
          <Link to="/gallery" onClick={closeMenu}>छायाचित्रे</Link>
          <Link to="/contact" onClick={closeMenu}>सदस्य</Link>

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
