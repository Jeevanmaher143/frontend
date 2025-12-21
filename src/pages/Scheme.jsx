import React, { useEffect, useState } from "react";
import "./Scheme.css";

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/schemes")
      .then((res) => res.json())
      .then((data) => {
        setSchemes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schemes:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="scheme-container">
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (schemes.length === 0) {
    return (
      <div className="scheme-container">
        <h2 className="scheme-title">Government Schemes</h2>
        <div className="empty-state">
          <h3>No Schemes Available</h3>
          <p>Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scheme-container">
      <h2 className="scheme-title">Government Schemes</h2>

      <div className="scheme-grid">
        {schemes.map((s) => (
          <div className="scheme-card" key={s._id}>
            <h3>{s.title}</h3>
            <p>{s.description}</p>

            <div className="scheme-info">
              <p>
                <b className="benefits-text">Benefits:</b> {s.benefits}
              </p>

              <p>
                <b className="eligibility-text">Eligibility:</b> {s.eligibility}
              </p>
            </div>

            {/* ✅ APPLY LINK */}
            {s.applyLink && (
              <a
                href={s.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
              >
                📝  Link to Apply Now
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scheme;
