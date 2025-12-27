import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Decorative wave top */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>

      <div className="footer-container">
        {/* Decorative shapes */}
        <div className="footer-decorative-shapes">
          <div className="footer-shape footer-shape-1"></div>
          <div className="footer-shape footer-shape-2"></div>
          <div className="footer-shape footer-shape-3"></div>
        </div>

        {/* ABOUT */}
        <div className="footer-section footer-about">
          <div className="footer-logo-wrapper">
            <div className="footer-logo-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="footer-logo-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <h3>ग्राम पंचायत रोषणखेडा</h3>
          </div>
          <p>
            ग्राम पंचायत रोषणखेडा डिजिटल पोर्टल हे पारदर्शक, आधुनिक आणि
            नागरिकाभिमुख प्रशासनाचे एक प्रभावी व्यासपीठ आहे. या पोर्टलच्या
            माध्यमातून ग्रामस्थांना विविध शासकीय सेवा, योजना, महत्त्वाच्या
            सूचना तसेच गावातील विकासकामांची सविस्तर माहिती सहज उपलब्ध होते.
          </p>
          <p>
            या डिजिटल प्रणालीमुळे नागरिकांना घरबसल्या ऑनलाइन अर्ज करणे,
            पंचायतच्या कामकाजाची माहिती मिळवणे तसेच ग्रामविकासात सक्रिय सहभाग
            घेणे शक्य झाले आहे. रोषणखेडा गावामध्ये डिजिटल सक्षमीकरण,
            कार्यक्षमता आणि जबाबदारी वाढविण्याच्या दृष्टीने हे पोर्टल एक
            महत्त्वाचे पाऊल ठरत आहे.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="section-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            द्रुत दुवे
          </h4>
          <ul>
            <li>
              <Link to="/">
                <span className="link-dot"></span>
                मुख्यपृष्ठ
              </Link>
            </li>
            <li>
              <Link to="/about">
                <span className="link-dot"></span>
                गावाबद्दल
              </Link>
            </li>
            <li>
              <Link to="/services">
                <span className="link-dot"></span>
                सेवा
              </Link>
            </li>
            <li>
              <Link to="/schemes">
                <span className="link-dot"></span>
                शासकीय योजना
              </Link>
            </li>
            <li>
              <Link to="/notices">
                <span className="link-dot"></span>
                सूचना
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <span className="link-dot"></span>
                सदस्य
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="section-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            संपर्क माहिती
          </h4>
          <div className="contact-item">
            <div className="contact-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <p>ग्राम पंचायत कार्यालय, रोषणखेडा</p>
          </div>
          <div className="contact-item">
            <div className="contact-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <p>+९१ ९९९८८ ८७७७७</p>
          </div>
          <div className="contact-item">
            <div className="contact-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <p>gproshankheda@gmail.com</p>
          </div>
        </div>

        {/* OFFICE INFO */}
        <div className="footer-section">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="section-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            कार्यालयीन वेळ
          </h4>
          <div className="office-time-card">
            <div className="time-row">
              <span className="day-label">सोमवार ते शुक्रवार</span>
              <span className="time-label">१०:०० - १७:००</span>
            </div>
            <div className="divider-line"></div>
            <div className="government-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="badge-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span>भारत सरकार मान्यताप्राप्त</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright-text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="copyright-icon">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9a3 3 0 00-6 0v6"/>
            </svg>
            {new Date().getFullYear()} डिजिटल ग्राम पंचायत रोषणखेडा. सर्व हक्क राखीव.
          </p>
          <p className="developer-text">
            विकसित केले: 
            <span className="dev-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="dev-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
              जीवन महेर
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;