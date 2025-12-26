import React, { useEffect, useState } from "react";
import "./ManageServices.css";

const API = "https://backend-9i6n.onrender.com";

const ManageServices = () => {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("pending");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // approved | rejected
  const [message, setMessage] = useState("");
  const [selectedAppId, setSelectedAppId] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchApplications = async () => {
    const res = await fetch(`${API}/api/admin/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ================= OPEN MODAL ================= */
  const openModal = (id, type) => {
    setSelectedAppId(id);
    setModalType(type);
    setMessage("");
    setShowModal(true);
  };

  /* ================= CONFIRM ================= */
  const confirmAction = async () => {
  if (!message.trim()) {
    alert("Message is required");
    return;
  }

  try {
    await fetch(
      `${API}/api/admin/services/${selectedAppId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: modalType === "approved" ? "Approved" : "Rejected",
          adminRemark: message,
        }),
      }
    );

    setShowModal(false);
    setSelectedAppId(null);
    setMessage("");
    fetchApplications();
  } catch (err) {
    alert("Failed to update application ❌");
  }
};


  /* ================= FILTER (FIXED) ================= */
  const filteredApps = applications.filter(
    (a) => a.status?.toLowerCase() === activeFilter
  );

  const count = (status) =>
    applications.filter((a) => a.status?.toLowerCase() === status).length;

  return (
    <div className="manage-services">
      <h2>Service Applications Management</h2>

      {/* FILTER BUTTONS */}
      <div className="filter-buttons">
        <button
          className={activeFilter === "pending" ? "active" : ""}
          onClick={() => setActiveFilter("pending")}
        >
          🕒 Pending ({count("pending")})
        </button>

        <button
          className={activeFilter === "approved" ? "active" : ""}
          onClick={() => setActiveFilter("approved")}
        >
          ✅ Approved ({count("approved")})
        </button>

        <button
          className={activeFilter === "rejected" ? "active" : ""}
          onClick={() => setActiveFilter("rejected")}
        >
          ❌ Rejected ({count("rejected")})
        </button>
      </div>

      {/* LIST */}
      <div className="cards-container">
        {filteredApps.length === 0 && (
          <p className="no-data">No applications found</p>
        )}

        {filteredApps.map((app) => (
          <div className="service-card" key={app._id}>
            <p><b>Name:</b> {app.fullName}</p>
            <p><b>Service:</b> {app.serviceType}</p>
            <p><b>Mobile:</b> {app.mobile}</p>

            {/* DOCUMENTS */}
            {app.documents && (
              <div className="documents-list">
                {Object.entries(app.documents).map(([name, url], i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    📎 {name}
                  </a>
                ))}
              </div>
            )}

            {/* ADMIN MESSAGE */}
            {app.adminRemark && (
              <p className="remark">
                <b>Admin Message:</b> {app.adminRemark}
              </p>
            )}

            {/* ACTIONS */}
            {activeFilter === "pending" && (
              <div className="actions">
                <button
                  className="approve-btn"
                  onClick={() => openModal(app._id, "approved")}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => openModal(app._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* POPUP */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>
              {modalType === "approved"
                ? "Approve Application"
                : "Reject Application"}
            </h3>

            <textarea
              placeholder={
                modalType === "approved"
                  ? "Your documents are ready. Come to Panchayat today at 4 PM."
                  : "Enter rejection reason"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmAction}>
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
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
