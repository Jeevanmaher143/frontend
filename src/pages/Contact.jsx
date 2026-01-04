import React, { useEffect, useState } from "react";
import "./Contact.css";

const API = "https://backend-9i6n.onrender.com";

const Contact = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContacts = async () => {
      try {
        if (!API) {
          throw new Error("API URL उपलब्ध नाही");
        }

        const res = await fetch(`${API}/api/contacts`);
        const text = await res.text();

        if (text.startsWith("<")) {
          throw new Error("JSON ऐवजी HTML प्रतिसाद प्राप्त झाला");
        }

        const data = JSON.parse(text);
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("संपर्क माहिती मिळवताना त्रुटी:", err);
        setError("संपर्क माहिती लोड करता आली नाही");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const cards = document.querySelectorAll(".contact-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [members]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="contact-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>संपर्क माहिती लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="contact-page">
        <div className="error-container">
          <div className="error-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="error-message">⚠️ {error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            पुन्हा प्रयत्न करा
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Animated Header */}
      <div className="contact-header">
        <div className="header-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h1>ग्राम पंचायत संपर्क निर्देशिका</h1>
        <p>आमच्या समर्पित कार्यसंघ सदस्यांशी संपर्क साधा</p>
        <div className="member-count">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{members.length} सदस्य</span>
        </div>
      </div>

      {/* Contact Grid */}
      {members.length > 0 ? (
        <div className="contact-grid">
          {members.map((m, index) => {
            const imageSrc =
              m.photo?.startsWith("http")
                ? m.photo
                : m.photo
                ? `${API}${m.photo}`
                : "https://via.placeholder.com/200?text=No+Image";

            return (
              <div
                className="contact-card"
                key={m._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-background"></div>
                
                <div className="image-container">
                  <div className="image-ring"></div>
                  <img
                    src={imageSrc}


                    
                    alt={m.name}
                    className="contact-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200?text=No+Image";
                    }}
                  />
                  <div className="image-overlay">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="card-content">
                  <h3>{m.name}</h3>
                  <p className="role">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {m.role}
                  </p>

                  <div className="contact-actions">
                    
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="email">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>ईमेल पाठवा</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3>कोणतीही संपर्क माहिती उपलब्ध नाही</h3>
          <p>कृपया नंतर परत या</p>
        </div>
      )}
    </div>
  );
};

export default Contact;