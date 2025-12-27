import React, { useEffect, useState } from "react";
import "./HeroSection.css";
import "./TypingAnimations.css"; // Import the new CSS file

const API = "https://backend-9i6n.onrender.com";

const HeroSection = () => {
  const [leaders, setLeaders] = useState([]);
  const [titleText, setTitleText] = useState("");
  const [descText, setDescText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const fullTitle = "Digital Gram पंचायत रोषणखेडा";
  const fullDescription = "रोषणखेडा ग्रामपंचायतीच्या अधिकृत डिजिटल पोर्टलवर आपले मनःपूर्वक स्वागत आहे. पारदर्शक प्रशासन, आधुनिक तंत्रज्ञान व नागरिकाभिमुख सेवा हे आमचे उद्दिष्ट आहे.";

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch(`${API}/api/contacts`);
        const data = await res.json();

        const filtered = data.filter(
          (m) => m.role === "Sarpanch" || m.role === "Upa-Sarpanch"
        );

        setLeaders(filtered.slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch leaders", err);
      }
    };

    fetchLeaders();
  }, []);

  // Faster typing animation for title
  useEffect(() => {
    let currentIndex = 0;
    const titleInterval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(titleInterval);
      }
    }, 50); // Faster - 50ms per character (was 80ms)

    return () => clearInterval(titleInterval);
  }, []);

  // Faster typing animation for description
  useEffect(() => {
    const descTimeout = setTimeout(() => {
      let currentIndex = 0;
      const descInterval = setInterval(() => {
        if (currentIndex <= fullDescription.length) {
          setDescText(fullDescription.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(descInterval);
          setShowCursor(false);
        }
      }, 20); // Faster - 20ms per character (was 30ms)

      return () => clearInterval(descInterval);
    }, fullTitle.length * 50 + 200); // Reduced delay (was 300ms)

    return () => clearTimeout(descTimeout);
  }, []);

  // Faster blinking cursor
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 400); // Faster blink (was 500ms)

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  return (
    <div className="hero-wrapper">
      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        alt="Village"
        className="hero-bg-image"
      />

      <div className="hero-gradient-overlay"></div>

      <div className="decorative-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="hero-content-grid">
        <div className="hero-text-section">
          <div className="hero-badge fade-in">
            <svg
              className="badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            अधिकृत ग्रामपंचायत पोर्टल
          </div>

          <h1 className="hero-title">
            {titleText.split(' ')[0] && <span>{titleText.split(' ')[0]} {titleText.split(' ')[1] || ''}</span>}
            <br />
            <span className="hero-title-accent">
              {titleText.split(' ').slice(2).join(' ')}
              {titleText.length < fullTitle.length && showCursor && <span className="typing-cursor">|</span>}
            </span>
          </h1>

          <p className="hero-description">
            {descText}
            {descText.length < fullDescription.length && showCursor && <span className="typing-cursor">|</span>}
          </p>
          <div className="hero-features"></div>
        </div>

        <div className="hero-leaders-section slide-in">
          <div className="leaders-header">
            <h3>आपले नेतृत्व</h3>
            <div className="leaders-underline"></div>
          </div>

          <div className="leaders-container">
            {leaders.map((member, index) => (
              <div 
                className="leader-profile" 
                key={member._id}
                style={{ 
                  animation: `fadeInUp 0.6s ease forwards ${1.5 + index * 0.2}s`,
                  opacity: 0
                }}
              >
                <div className="leader-image-wrapper">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="leader-image"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />

                  <div className="leader-ring"></div>
                </div>
                <div className="leader-info">
                  <h4 className="leader-name">{member.name}</h4>
                  <p className="leader-role">
                    {member.role.toLowerCase().includes("upa") ? "उपसरपंच" : "सरपंच"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="leaders-decoration">
            <svg viewBox="0 0 100 100" className="decoration-svg">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;