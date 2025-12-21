import React, { useEffect, useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/contacts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contacts");
        return res.json();
      })
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contacts", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  if (error) {
    return (
      <div className="contact-page">
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-title">Gram Panchayat Contact Directory</h1>
        <p className="contact-subtitle">
          Connect with our dedicated team members
        </p>
      </div>

      <div className="contact-grid">
        {members.map((m) => (
          <div className="contact-card" key={m._id}>
            <div className="card-image-wrapper">
              <img
                // src={`http://localhost:5000${m.photo}`}
                // alt={m.name}
                src={m.photo}
                alt={m.name}  // in this use CLoud to store 
                className="contact-img"
                style={{ display: "block", margin: "0 auto" }} // Ensures horizontal centering
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200?text=No+Image";
                }}
              />
            </div>

            <div className="card-content">
              <h3 className="contact-name">{m.name}</h3>
              <p className="contact-role">{m.role}</p>

              <div className="contact-details">
                <a href={`tel:${m.phone}`} className="contact-info phone">
                  <span className="icon">📞</span>
                  <span className="text">{m.phone}</span>
                </a>

                {m.email && (
                  <a href={`mailto:${m.email}`} className="contact-info email">
                    <span className="icon">✉️</span>
                    <span className="text">{m.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="empty-state">
          <p>No contacts available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
