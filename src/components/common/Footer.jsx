import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ABOUT */}
        <div className="footer-section">
          <h3>Gram Panchayat</h3>
          <p>
            Gram Panchayat Palshi Digital Portal is a transparent governance
            platform that provides easy access to citizen services, government
            schemes, notices, and development updates. It helps villagers apply
            for services online, stay informed about Panchayat activities, and
            promotes accountability, efficiency, and digital empowerment in
            Palshi village.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/schemes">Schemes</Link>
            </li>
            <li>
              <Link to="/notices">Notices</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📍 Gram Panchayat Office</p>
          <p>📞 +91 99988 87777</p>
          <p>✉️ grampanchayat@gmail.com</p>
        </div>

        {/* OFFICE INFO */}
        <div className="footer-section">
          <h4>Office Hours</h4>
          <p>Mon - Fri: 10 AM - 5 PM</p>
          <p>Government of India</p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Digital Gram Panchayat. All Rights
          Reserved.
        </p>
        <p>
          Developed by <span className="dev-name">Jeevan Maher</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
