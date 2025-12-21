import React, { useEffect, useState } from "react";
import "./ManageComplaints.css";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [responseText, setResponseText] = useState("");

  const token = localStorage.getItem("token");

  // ================= FETCH COMPLAINTS =================
  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
      setFilteredComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= FILTER BY STATUS =================
  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(
        complaints.filter((complaint) => complaint.status === filterStatus)
      );
    }
  }, [filterStatus, complaints]);

  // ================= VIEW COMPLAINT DETAILS =================
  const viewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setResponseText(complaint.adminResponse || "");
    setViewModal(true);
  };

  // ================= UPDATE COMPLAINT STATUS =================
  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/complaints/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ================= SUBMIT ADMIN RESPONSE =================
  const submitResponse = async () => {
    if (!responseText.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      await fetch(
        `http://localhost:5000/api/complaints/${selectedComplaint._id}/response`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminResponse: responseText }),
        }
      );

      setViewModal(false);
      setSelectedComplaint(null);
      setResponseText("");
      fetchComplaints();
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  // ================= DELETE COMPLAINT =================
  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    try {
      await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComplaints();
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  // ================= CLOSE MODAL =================
  const closeModal = () => {
    setViewModal(false);
    setSelectedComplaint(null);
    setResponseText("");
  };

  // ================= GET STATUS COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Resolved":
        return "status-resolved";
      default:
        return "";
    }
  };

  return (
    <div className="manage-complaints">
      <div className="header-section">
        <h2>Manage Complaints</h2>
        <p className="subtitle">View and respond to citizen complaints</p>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button
            className={filterStatus === "All" ? "active" : ""}
            onClick={() => setFilterStatus("All")}
          >
            All ({complaints.length})
          </button>
          <button
            className={filterStatus === "Pending" ? "active" : ""}
            onClick={() => setFilterStatus("Pending")}
          >
            Pending (
            {complaints.filter((c) => c.status === "Pending").length})
          </button>
          <button
            className={filterStatus === "In Progress" ? "active" : ""}
            onClick={() => setFilterStatus("In Progress")}
          >
            In Progress (
            {complaints.filter((c) => c.status === "In Progress").length})
          </button>
          <button
            className={filterStatus === "Resolved" ? "active" : ""}
            onClick={() => setFilterStatus("Resolved")}
          >
            Resolved (
            {complaints.filter((c) => c.status === "Resolved").length})
          </button>
        </div>
      </div>

      {/* COMPLAINTS LIST */}
      <div className="complaints-section">
        {filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <p>No complaints found</p>
          </div>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map((complaint) => (
              <div className="complaint-card" key={complaint._id}>
                <div className="card-header">
                  <h4 className="complaint-title">{complaint.title}</h4>
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="complaint-info">
                  <p className="info-row">
                    <strong>Category:</strong> {complaint.category}
                  </p>
                  <p className="info-row">
                    <strong>Submitted by:</strong> {complaint.userName || "Anonymous"}
                  </p>
                  <p className="info-row">
                    <strong>Date:</strong>{" "}
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="complaint-description">
                  {complaint.description.length > 100
                    ? `${complaint.description.slice(0, 100)}...`
                    : complaint.description}
                </p>

                <div className="card-actions">
                  <button
                    className="btn btn-view"
                    onClick={() => viewComplaint(complaint)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteComplaint(complaint._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW/RESPONSE MODAL */}
      {viewModal && selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Complaint Details</h3>
              <button className="close-icon" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <label>Title:</label>
                <p>{selectedComplaint.title}</p>
              </div>

              <div className="detail-row">
                <label>Category:</label>
                <p>{selectedComplaint.category}</p>
              </div>

              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${getStatusColor(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              <div className="detail-row">
                <label>Submitted by:</label>
                <p>{selectedComplaint.userName || "Anonymous"}</p>
              </div>

              <div className="detail-row">
                <label>Contact:</label>
                <p>{selectedComplaint.userEmail || "N/A"}</p>
              </div>

              <div className="detail-row">
                <label>Date:</label>
                <p>
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="detail-row full-width">
                <label>Description:</label>
                <p className="description-text">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.attachment && (
                <div className="detail-row full-width">
                  <label>Attachment:</label>
                  <a
                    href={`http://localhost:5000${selectedComplaint.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    View Attachment
                  </a>
                </div>
              )}

              {/* UPDATE STATUS */}
              <div className="status-update-section">
                <label>Update Status:</label>
                <div className="status-buttons">
                  <button
                    className={`status-btn ${
                      selectedComplaint.status === "Pending" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateStatus(selectedComplaint._id, "Pending")
                    }
                  >
                    Pending
                  </button>
                  <button
                    className={`status-btn ${
                      selectedComplaint.status === "In Progress" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateStatus(selectedComplaint._id, "In Progress")
                    }
                  >
                    In Progress
                  </button>
                  <button
                    className={`status-btn ${
                      selectedComplaint.status === "Resolved" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateStatus(selectedComplaint._id, "Resolved")
                    }
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* ADMIN RESPONSE */}
              <div className="response-section">
                <label>Admin Response:</label>
                <textarea
                  className="response-textarea"
                  placeholder="Enter your response to the citizen..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows="5"
                />
                <button className="btn btn-submit" onClick={submitResponse}>
                  Submit Response
                </button>
              </div>

              {selectedComplaint.adminResponse && (
                <div className="detail-row full-width">
                  <label>Previous Response:</label>
                  <p className="previous-response">
                    {selectedComplaint.adminResponse}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;