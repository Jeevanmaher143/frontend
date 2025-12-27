import React, { useEffect, useState } from "react";
import "./ManageNotices.css";

const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

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
  const [editFile, setEditFile] = useState(null);

  // Loading states
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // Popup message state
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const token = localStorage.getItem("token");

  /* ================= SHOW POPUP ================= */
  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 1500);
  };

  /* ================= FETCH ================= */
  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API}/api/notices`);
      const data = await res.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch notice error:", err);
      showPopup("Failed to fetch notices", "error");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  /* ================= ADD ================= */
  const addNotice = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("isImportant", isImportant);
      if (file) formData.append("attachment", file);

      const res = await fetch(`${API}/api/notices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setIsImportant(false);
        setFile(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";

        showPopup("🎉 Notice added successfully!", "success");
        fetchNotices();
      } else {
        showPopup("Failed to add notice", "error");
      }
    } catch (err) {
      console.error("Add notice error:", err);
      showPopup("An error occurred while adding notice", "error");
    } finally {
      setIsAdding(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    setIsDeleting(id);

    try {
      const res = await fetch(`${API}/api/notices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        showPopup("🗑️ Notice deleted successfully", "success");
        fetchNotices();
      } else {
        showPopup("Failed to delete notice", "error");
      }
    } catch (err) {
      console.error("Delete notice error:", err);
      showPopup("An error occurred while deleting", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  /* ================= OPEN EDIT ================= */
  const openEditPopup = (notice) => {
    setCurrentEdit(notice);
    setEditTitle(notice.title);
    setEditDescription(notice.description);
    setEditFile(null);
    setEditPopup(true);
  };

  /* ================= UPDATE ================= */
  const updateNotice = async () => {
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      if (editFile) formData.append("attachment", editFile);

      const res = await fetch(`${API}/api/notices/${currentEdit._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setEditPopup(false);
        setCurrentEdit(null);
        showPopup("✨ Notice updated successfully!", "success");
        fetchNotices();
      } else {
        showPopup("Failed to update notice", "error");
      }
    } catch (err) {
      console.error("Update notice error:", err);
      showPopup("An error occurred while updating", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  /* ================= ATTACHMENT URL ================= */
  const getAttachmentUrl = (attachment) => {
    if (!attachment) return null;
    return attachment.startsWith("http")
      ? attachment
      : `${API}${attachment}`;
  };

  return (
    <div className="manage-notices">
      {/* POPUP MESSAGE */}
      {popup.show && (
        <div className="popup-overlay" onClick={() => setPopup({ show: false, message: "", type: "" })}>
          <div className={`popup ${popup.type}`} onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">
              {popup.type === "success" ? "✅" : "❌"}
            </div>
            <p className="popup-message">{popup.message}</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header-section">
        <h2>📋 Manage Notices</h2>
        <p className="subtitle">Create, edit, and manage all your notices</p>
      </div>

      {/* ADD FORM */}
      <div className="form-container">
        <h3 className="form-title">➕ Add New Notice</h3>
        <form className="notice-form" onSubmit={addNotice}>
          <div className="form-group">
            <label>Notice Title *</label>
            <input
              type="text"
              placeholder="Enter notice title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isAdding}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Enter detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isAdding}
            />
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              disabled={isAdding}
            />
            <span>⭐ Mark as Important</span>
          </label>

          {/* <div className="form-group">
            <label>Attachment (PDF, JPG, PNG)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isAdding}
            />
          </div> */}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="btn-loader"></span>
                <span style={{ marginLeft: '8px' }}>Adding...</span>
              </>
            ) : (
              "Add Notice"
            )}
          </button>
        </form>
      </div>

      {/* NOTICE LIST */}
      <div className="notices-section">
        <h3 className="section-title">📌 All Notices ({notices.length})</h3>
        
        {notices.length === 0 ? (
          <div className="empty-state">
            <p>📭 No notices found. Create your first notice above!</p>
          </div>
        ) : (
          <div className="notice-list">
            {notices.map((n) => (
              <div
                key={n._id}
                className={`notice-card ${n.isImportant ? "important" : ""}`}
              >
                {n.isImportant && (
                  <span className="important-badge">⚠️ Important</span>
                )}
                
                <h4 className="notice-title">{n.title}</h4>
                <p className="notice-description">{n.description}</p>

                {n.attachment && (
                  <a
                    href={getAttachmentUrl(n.attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    📎 View Attachment
                  </a>
                )}

                <div className="card-actions">
                  <button 
                    onClick={() => openEditPopup(n)}
                    className="btn btn-secondary"
                    disabled={isDeleting === n._id}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => deleteNotice(n._id)}
                    className="btn btn-danger"
                    disabled={isDeleting === n._id}
                  >
                    {isDeleting === n._id ? (
                      <>
                        <span className="btn-loader-red"></span>
                      </>
                    ) : (
                      "🗑️ Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editPopup && (
        <div className="modal-overlay" onClick={() => !isUpdating && setEditPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">✏️ Edit Notice</h3>
              <button 
                className="close-icon"
                onClick={() => setEditPopup(false)}
                disabled={isUpdating}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Notice Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isUpdating}
              />
            </div>

            {currentEdit?.attachment && (
              <div className="current-attachment">
                <label>Current Attachment:</label>
                <a
                  href={getAttachmentUrl(currentEdit.attachment)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📎 View Current File
                </a>
              </div>
            )}

            <div className="form-group">
              <label>New Attachment (Optional)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setEditFile(e.target.files[0])}
                disabled={isUpdating}
              />
            </div>

            <div className="modal-actions">
              <button 
                onClick={updateNotice}
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="btn-loader"></span>
                    <span style={{ marginLeft: '8px' }}>Saving...</span>
                  </>
                ) : (
                  "💾 Save Changes"
                )}
              </button>
              <button 
                onClick={() => setEditPopup(false)}
                className="btn btn-secondary"
                disabled={isUpdating}
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