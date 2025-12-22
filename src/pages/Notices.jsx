import React, { useEffect, useState } from "react";
import "./Notices.css";

/* ✅ SAME PATTERN AS ApplyService */
const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${API}/api/notices`);
        if (!res.ok) throw new Error("Failed to fetch notices");

        const data = await res.json();

        if (Array.isArray(data)) {
          // ✅ Important first, latest first
          const sorted = data.sort((a, b) => {
            if (a.isImportant === b.isImportant) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return b.isImportant - a.isImportant;
          });
          setNotices(sorted);
        } else {
          setNotices([]);
        }
      } catch (err) {
        console.error("Notice fetch error:", err);
        setError("Unable to load notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="notice-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p className="loading-text">Loading notices...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="notice-container">
        <div className="error-box">
          <p className="error-text">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-container">
      <div className="notice-content">

        {/* HEADER */}
        <div className="notice-header">
          <h1 className="header-title">Notice Board</h1>
          <p className="header-subtitle">
            Stay updated with the latest announcements
          </p>
        </div>

        {/* NOTICE LIST */}
        {notices.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">
              No notices available at the moment
            </p>
          </div>
        ) : (
          <div className="notice-grid">
            {notices.map((notice) => {
              /* ✅ CLOUD + LOCAL ATTACHMENT SUPPORT */
              const attachmentUrl =
                notice.attachment?.startsWith("http")
                  ? notice.attachment
                  : notice.attachment
                  ? `${API}${notice.attachment}`
                  : null;

              return (
                <div
                  key={notice._id}
                  className={`notice-card ${
                    notice.isImportant ? "notice-important" : ""
                  }`}
                >
                  {notice.isImportant && (
                    <div className="important-ribbon">
                      <span>IMPORTANT</span>
                    </div>
                  )}

                  <div className="notice-body">
                    <h3 className="notice-title">
                      {notice.title}
                    </h3>

                    <p className="notice-date">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>

                    <p className="notice-description">
                      {notice.description}
                    </p>

                    {/* ATTACHMENT */}
                    {attachmentUrl && (
                      <a
                        href={attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="notice-attachment"
                      >
                        View / Download Document
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
