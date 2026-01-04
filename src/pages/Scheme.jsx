import React, { useEffect, useState } from "react";
import "./Scheme.css";

const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchSchemes = async () => {
      try {
        const res = await fetch(`${API}/api/schemes`);
        if (!res.ok) throw new Error("Failed to fetch schemes");

        const data = await res.json();
        setSchemes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Scheme fetch error:", err);
        setError("योजना लोड करता आल्या नाहीत");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="scheme-container">
        <p className="loading-text">योजना लोड होत आहेत...</p>
      </div>
    );
  }

  /* ===== ERROR ===== */
  if (error) {
    return (
      <div className="scheme-container">
        <p className="error-text">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="scheme-container">
      <h2 className="scheme-title">शासकीय योजना</h2>

      {schemes.length === 0 ? (
        <p className="empty-text">कोणतीही योजना उपलब्ध नाही</p>
      ) : (
        <div className="scheme-grid">
          {schemes.map((s) => (
            <div className="scheme-card small" key={s._id}>
              
              {/* HEADER */}
              <div className="scheme-card-header">
                <h3>{s.title}</h3>
                <span
                  className={`scheme-badge ${
                    s.schemeType === "State" ? "state" : "central"
                  }`}
                >
                  {s.schemeType === "State" ? "राज्य योजना" : "केंद्र योजना"}
                </span>
              </div>

              {/* DESCRIPTION */}
              {s.description && (
                <p className="scheme-desc">{s.description}</p>
              )}

              {/* DETAILS */}
              <div className="scheme-details">
                <p>
                  <strong>🎁 लाभ:</strong>{" "}
                  {s.benefits || "माहिती उपलब्ध नाही"}
                </p>

                <p>
                  <strong>👥 पात्रता:</strong>{" "}
                  {s.eligibility || "माहिती उपलब्ध नाही"}
                </p>

                {s.applyProcess && (
                  <p>
                    <strong>📝 अर्ज प्रक्रिया:</strong>{" "}
                    {s.applyProcess}
                  </p>
                )}
              </div>

              {/* APPLY */}
              {s.applyLink && (
                <a
                  href={s.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-btn"
                >
                  अर्ज करा
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scheme;
