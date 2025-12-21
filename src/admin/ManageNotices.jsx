import React, { useEffect, useState } from "react";
import "./ManageNotices.css";

const ManageNotices = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [file, setFile] = useState(null);

  const [notices, setNotices] = useState([]);
  
  const [editPopup, setEditPopup] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchNotices = async () => {
    const res = await fetch("http://localhost:5000/api/notices");
    const data = await res.json();
    setNotices(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ================= ADD =================
  const addNotice = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isImportant", isImportant);
    if (file) formData.append("attachment", file);

    await fetch("http://localhost:5000/api/notices", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setTitle("");
    setDescription("");
    setIsImportant(false);
    setFile(null);
    setMessage("Notice added successfully");
    setTimeout(() => setMessage(""), 3000);
    fetchNotices();
  };

  // ================= DELETE =================
  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    await fetch(`http://localhost:5000/api/notices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMessage("Notice deleted successfully");
    setTimeout(() => setMessage(""), 3000);
    fetchNotices();
  };

  // ================= OPEN EDIT POPUP =================
  const openEditPopup = (notice) => {
    setCurrentEdit(notice);
    setEditTitle(notice.title);
    setEditDescription(notice.description);
    setEditPopup(true);
  };

  // ================= UPDATE =================
  const updateNotice = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title and description cannot be empty");
      return;
    }

    await fetch(`http://localhost:5000/api/notices/${currentEdit._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    });

    setEditPopup(false);
    setCurrentEdit(null);
    setMessage("Notice updated successfully");
    setTimeout(() => setMessage(""), 2000);
    fetchNotices();
  };

  return (
    <div className="manage-notices">
      <div className="header-section">
        <h2>Manage Notices</h2>
        <p className="subtitle">Create and manage your organization's notices</p>
      </div>

      {message && <div className="success-msg">{message}</div>}

      {/* ADD FORM */}
      <div className="form-container">
        <h3 className="form-title">Create New Notice</h3>
        <form className="notice-form" onSubmit={addNotice}>
          <div className="form-group">
            <label>Title</label>
            <input
              placeholder="Enter notice title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter notice description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
              />
              <span>Mark as Important</span>
            </label>
          </div>

          <div className="form-group">
            <label>Attachment (Optional)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Notice
          </button>
        </form>
      </div>

      {/* NOTICE LIST */}
      <div className="notices-section">
        <h3 className="section-title">All Notices</h3>
        <div className="notice-list">
          {notices.length === 0 ? (
            <div className="empty-state">
              <p>No notices available</p>
            </div>
          ) : (
            notices.map((n) => (
              <div
                className={`notice-card ${n.isImportant ? "important" : ""}`}
                key={n._id}
              >
                {n.isImportant && (
                  <div className="important-badge">Important</div>
                )}
                
                <h4 className="notice-title">{n.title}</h4>
                <p className="notice-description">
                  {n.description.length > 100
                    ? `${n.description.slice(0, 100)}...`
                    : n.description}
                </p>

                {n.attachment && (
                  <a
                    href={`http://localhost:5000${n.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    View Attachment
                  </a>
                )}

                <div className="card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => openEditPopup(n)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteNotice(n._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* EDIT POPUP */}
      {editPopup && (
        <div className="modal-overlay" onClick={() => {
          setEditPopup(false);
          setCurrentEdit(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Notice</h3>
              <button 
                className="close-icon"
                onClick={() => {
                  setEditPopup(false);
                  setCurrentEdit(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Notice Title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Notice Description"
                rows="8"
              />
            </div>

            {currentEdit.attachment && (
              <div className="current-attachment">
                <label>Current Attachment:</label>
                <a
                  href={`http://localhost:5000${currentEdit.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Current Attachment
                </a>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={updateNotice}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditPopup(false);
                  setCurrentEdit(null);
                }}
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

export default ManageNotices;