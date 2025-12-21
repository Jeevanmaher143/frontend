import React, { useEffect, useState } from "react";
import "./Contact.css";

//const API = process.env.REACT_APP_API_URL;
const API ="https://backend-9i6n.onrender.com";


const Contact = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!API) {
          throw new Error("API URL not configured");
        }

        const res = await fetch(`${API}/api/contacts`);
        const text = await res.text();

        // 🛑 Backend must return JSON, not HTML
        if (text.startsWith("<")) {
          throw new Error("HTML response received instead of JSON");
        }

        const data = JSON.parse(text);
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Contact fetch error:", err);
        setError("Unable to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="contact-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading contact details...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="contact-page">
        <p className="error-message">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Gram Panchayat Contact Directory</h1>
        <p>Connect with our dedicated team members</p>
      </div>

      <div className="contact-grid">
        {members.map((m) => {
          const imageSrc =
            m.photo?.startsWith("http")
              ? m.photo
              : m.photo
              ? `${API}${m.photo}`
              : "https://via.placeholder.com/200?text=No+Image";

          return (
            <div className="contact-card" key={m._id}>
              <img
                src={imageSrc}
                alt={m.name}
                className="contact-img"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200?text=No+Image";
                }}
              />

              <h3>{m.name}</h3>
              <p className="role">{m.role}</p>

              {m.phone && (
                <a href={`tel:${m.phone}`} className="phone">
                  📞 {m.phone}
                </a>
              )}

              {m.email && (
                <a href={`mailto:${m.email}`} className="email">
                  ✉️ {m.email}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {members.length === 0 && (
        <p className="empty-state">No contacts available</p>
      )}
    </div>
  );
};

export default Contact;
