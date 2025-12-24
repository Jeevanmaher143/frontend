import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

/* ✅ CLOUD BACKEND */
const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const ApplicationStatus = () => {
  const { token } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${API}/api/services/user/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch applications error:", err);
        setError("Unable to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchApplications();
  }, [token]);

  /* LOADING */
  if (loading) {
    return (
      <div className="application-status-container">
        <p>Loading...</p>
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="application-status-container">
        <p style={{ color: "red" }}>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="application-status-container">
      <h2>Your Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="application-card">
            <p>
              <strong>Service:</strong> {app.serviceType}
            </p>

            <p>
              <strong>Status:</strong> {app.status}
            </p>

            {app.adminRemark && (
              <p>
                <strong>Remark:</strong> {app.adminRemark}
              </p>
            )}

            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(app.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationStatus;
