import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ApplicationStatus = () => {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/services/user/applications",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="application-status-container">
      <h2>Your Applications</h2>
      {applications.length === 0 && <p>No applications found.</p>}
      {applications.map((app) => (
        <div key={app._id} className="application-card">
          <p><strong>Service:</strong> {app.serviceType}</p>
          <p><strong>Status:</strong> {app.status}</p>
          {app.adminRemark && <p><strong>Remark:</strong> {app.adminRemark}</p>}
          <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatus;
