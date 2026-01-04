import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

/* BACKEND URL */
const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const UserProfile = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
    if (token) fetchProfile();
  }, [token]);

  /* ================= CANCEL APPLICATION ================= */
  const cancelApplication = async (id) => {
    if (!window.confirm("ही अर्ज रद्द करायची आहे का?")) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API}/api/services/application/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProfile(); // refresh list
    } catch (err) {
      alert("अर्ज रद्द करता आला नाही ❌");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= RE-APPLY ================= */
  const reApply = (serviceType) => {
    navigate(`/apply-service?service=${encodeURIComponent(serviceType)}`);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <p className="loading-text">Loading profile...</p>;
  }

  if (!profile) return null;

  const { user, services = [] } = profile;

  return (
    <div className="profile-container">
      <h2>👤 User Profile</h2>

      {/* ================= USER INFO ================= */}
      <div className="profile-card">
        <p><b>Name:</b> {user.fullName}</p>
        <p><b>Email:</b> {user.email || "N/A"}</p>
        <p><b>Mobile:</b> {user.mobile || "N/A"}</p>
        <p><b>Village:</b> {user.village || "N/A"}</p>

        {user.createdAt && (
          <p>
            <b>Joined:</b>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* ================= USER APPLICATIONS ================= */}
      <h3>📄 Your Applications</h3>

      {services.length === 0 ? (
        <p className="no-data">No applications submitted yet</p>
      ) : (
        <div className="applications-list">
          {services.map((s) => {
            const statusLower = s.status?.toLowerCase();

            return (
              <div key={s._id} className="application-card">
                <p><b>Service:</b> {s.serviceType}</p>

                <p>
                  <b>Status:</b>{" "}
                  <span className={`status ${statusLower}`}>
                    {s.status}
                  </span>
                </p>

                {s.createdAt && (
                  <p>
                    <b>Applied On:</b>{" "}
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                )}

                {/* ADMIN MESSAGE */}
                {s.adminRemark && (
                  <p
                    className={
                      s.status === "Approved"
                        ? "approve-message"
                        : "reject-reason"
                    }
                  >
                    <b>
                      {s.status === "Approved"
                        ? "Message:"
                        : "Reason:"}
                    </b>{" "}
                    {s.adminRemark}
                  </p>
                )}

                {/* 🔴 ACTIONS ONLY FOR REJECTED */}
                {s.status === "Rejected" && (
                  <div className="user-actions">
                    

                    <button
                      className="reapply-btn"
                      onClick={() => reApply(s.serviceType)}
                    >
                      🔁 Re-Apply
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
