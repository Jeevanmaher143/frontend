import React, { useEffect, useState } from "react";
import "./Notices.css";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notices");
        if (!res.ok) throw new Error("Failed to fetch notices");

        const data = await res.json();

        if (Array.isArray(data)) {
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
        setError("Unable to load notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

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

  if (error) {
    return (
      <div className="notice-container">
        <div className="error-box">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-container">
      <div className="notice-content">
        {/* Header */}
        <div className="notice-header">
          <div className="header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h1 className="header-title">Notice Board</h1>
          <p className="header-subtitle">Stay updated with the latest announcements</p>
        </div>

        {/* Notice List */}
        {notices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="empty-text">No notices available at the moment</p>
          </div>
        ) : (
          <div className="notice-grid">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className={`notice-card ${notice.isImportant ? "notice-important" : ""}`}
              >
                {notice.isImportant && (
                  <div className="important-ribbon">
                    <svg className="ribbon-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>IMPORTANT</span>
                  </div>
                )}

                <div className="notice-body">
                  <h3 className="notice-title">{notice.title}</h3>
                  
                  <div className="notice-meta">
                    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="notice-date">
                      {new Date(notice.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="notice-description">{notice.description}</p>

                  {notice.attachment && (
                    <a
                      href={`http://localhost:5000${notice.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notice-attachment"
                    >
                      <svg className="attachment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View / Download Document</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;