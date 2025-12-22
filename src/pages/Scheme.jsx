import React, { useEffect, useState } from "react";
import "./Scheme.css";

/* ✅ CLOUD BACKEND SUPPORT */
const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch(`${API}/api/schemes`);
        if (!res.ok) throw new Error("Failed to fetch schemes");

        const data = await res.json();
        setSchemes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Scheme fetch error:", err);
        setError("Unable to load schemes");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="scheme-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading schemes...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="scheme-container">
        <h2 className="scheme-title">Government Schemes</h2>
        <p className="error-text">⚠️ {error}</p>
      </div>
    );
  }

  /* ================= EMPTY ================= */
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

  /* ================= DATA ================= */
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
                <b className="benefits-text">Benefits:</b>{" "}
                {s.benefits || "N/A"}
              </p>

              <p>
                <b className="eligibility-text">Eligibility:</b>{" "}
                {s.eligibility || "N/A"}
              </p>
            </div>

            {/* APPLY LINK */}
            {s.applyLink && (
              <a
                href={s.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
              >
                📝 Apply Now
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scheme;
