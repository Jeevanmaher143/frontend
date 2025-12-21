import React, { useEffect, useState } from "react";
import "./ManageServices.css";

const ManageServices = () => {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedAppId, setSelectedAppId] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH APPLICATIONS ================= */
  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status, adminRemark = "") => {
    try {
      await fetch(`http://localhost:5000/api/admin/services/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminRemark }), // ✅ FIXED
      });

      fetchApplications();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  /* ================= REJECT HANDLERS ================= */
  const handleReject = (id) => {
    setSelectedAppId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    updateStatus(selectedAppId, "Rejected", rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedAppId(null);
  };

  const cancelReject = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedAppId(null);
  };

  /* ================= FILTERS ================= */
  const pending = applications.filter((a) => a.status === "Pending");
  const approved = applications.filter((a) => a.status === "Approved");
  const rejected = applications.filter((a) => a.status === "Rejected");

  const getFilteredApps = () => {
    if (activeFilter === "Approved") return approved;
    if (activeFilter === "Rejected") return rejected;
    return pending;
  };

  const filteredApps = getFilteredApps();

  return (
    <div className="manage-services">
      <h2>Service Applications Management</h2>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="filter-buttons">
        <button
          className={`filter-btn pending-btn ${
            activeFilter === "Pending" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Pending")}
        >
          🕒 Pending ({pending.length})
        </button>

        <button
          className={`filter-btn approved-btn ${
            activeFilter === "Approved" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Approved")}
        >
          ✅ Approved ({approved.length})
        </button>

        <button
          className={`filter-btn rejected-btn ${
            activeFilter === "Rejected" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Rejected")}
        >
          ❌ Rejected ({rejected.length})
        </button>
      </div>

      {/* ================= APPLICATION LIST ================= */}
      <section className="applications-section">
        {filteredApps.length === 0 && (
          <p className="no-data">
            No {activeFilter.toLowerCase()} applications
          </p>
        )}

        <div className="cards-container">
          {filteredApps.map((app) => (
            <div className="service-card" key={app._id}>
              <p><b>Name:</b> {app.fullName}</p>
              <p><b>Service:</b> {app.serviceType}</p>
              <p><b>Mobile:</b> {app.mobile}</p>
              <p><b>Address:</b> {app.address}</p>
              <p>
                <b>Date:</b>{" "}
                {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {/* ================= DOCUMENTS ================= */}
              {app.documents && Object.keys(app.documents).length > 0 && (
                <div className="documents-section">
                  <b>📄 Uploaded Documents:</b>

                  <div className="documents-list">
                    {Object.entries(app.documents).map(
                      ([key, value], index) => (
                        <a
                          key={index}
                          href={value}               // ✅ CLOUDINARY URL
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          📎 {key.replace(/([A-Z])/g, " $1")}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ================= REJECTED ================= */}
              {activeFilter === "Rejected" && app.adminRemark && (
                <div className="rejection-reason">
                  <b>Rejection Reason:</b>
                  <p>{app.adminRemark}</p>
                </div>
              )}

              {/* ================= ACTIONS ================= */}
              {activeFilter === "Pending" && (
                <div className="actions">
                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(app._id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(app._id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= REJECT MODAL ================= */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>❌ Reject Application</h3>

            <textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows="4"
            />

            <div className="modal-actions">
              <button className="confirm-reject-btn" onClick={confirmReject}>
                Confirm Reject
              </button>
              <button className="cancel-btn" onClick={cancelReject}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
