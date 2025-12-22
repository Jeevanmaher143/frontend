import React, { useEffect, useState } from "react";
import "./ManageSchemes.css";

/* ✅ CLOUD BACKEND */
const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const ManageSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // success or error

  const [form, setForm] = useState({
    title: "",
    description: "",
    benefits: "",
    eligibility: "",
    applyProcess: "",
    applyLink: "",
    schemeType: "Central",
  });

  const token = localStorage.getItem("token");

  /* ================= SHOW POPUP ================= */
  const displayPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  /* ================= FETCH ================= */
  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API}/api/schemes`);
      const data = await res.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch schemes error:", err);
      displayPopup("Failed to load schemes", "error");
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE ================= */
  const submitScheme = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = editingId
      ? `${API}/api/schemes/${editingId}`
      : `${API}/api/schemes`;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const message = editingId 
          ? "Scheme updated successfully!" 
          : "Scheme added successfully!";
        displayPopup(message, "success");
        resetForm();
        fetchSchemes();
      } else {
        displayPopup("Failed to save scheme", "error");
      }
    } catch (err) {
      console.error("Submit scheme error:", err);
      displayPopup("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (scheme) => {
    setEditingId(scheme._id);
    setForm({
      title: scheme.title,
      description: scheme.description || "",
      benefits: scheme.benefits || "",
      eligibility: scheme.eligibility || "",
      applyProcess: scheme.applyProcess || "",
      applyLink: scheme.applyLink || "",
      schemeType: scheme.schemeType || "Central",
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ================= DELETE ================= */
  const deleteScheme = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheme?")) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API}/api/schemes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        displayPopup("Scheme deleted successfully!", "success");
        fetchSchemes();
      } else {
        displayPopup("Failed to delete scheme", "error");
      }
    } catch (err) {
      console.error("Delete scheme error:", err);
      displayPopup("An error occurred while deleting", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      benefits: "",
      eligibility: "",
      applyProcess: "",
      applyLink: "",
      schemeType: "Central",
    });
  };

  return (
    <div className="manage-schemes">
      <h2>Manage Government Schemes</h2>

      {/* SUCCESS/ERROR POPUP */}
      {showPopup && (
        <div className={`popup-notification ${popupType} ${showPopup ? 'show' : ''}`}>
          <div className="popup-content">
            <span className="popup-icon">
              {popupType === "success" ? "✓" : "✕"}
            </span>
            <span className="popup-message">{popupMessage}</span>
          </div>
          <button 
            className="popup-close" 
            onClick={() => setShowPopup(false)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* FORM */}
      <form className="scheme-form" onSubmit={submitScheme}>
        <h3 className="schemedata">
          {editingId ? "Edit Scheme Data" : "Enter Scheme Data"}
        </h3>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          disabled={isLoading}
        />

        <textarea
          name="benefits"
          placeholder="Benefits"
          value={form.benefits}
          onChange={handleChange}
          disabled={isLoading}
        />

        <textarea
          name="eligibility"
          placeholder="Eligibility"
          value={form.eligibility}
          onChange={handleChange}
          disabled={isLoading}
        />

        <textarea
          name="applyProcess"
          placeholder="Apply Process"
          value={form.applyProcess}
          onChange={handleChange}
          disabled={isLoading}
        />

        <input
          type="url"
          name="applyLink"
          placeholder="Apply Link (https://...)"
          value={form.applyLink}
          onChange={handleChange}
          disabled={isLoading}
        />

        <select
          name="schemeType"
          value={form.schemeType}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="Central">Central</option>
          <option value="State">State</option>
        </select>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>{editingId ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <span>{editingId ? "Update Scheme" : "Add Scheme"}</span>
            )}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="scheme-list">
        {schemes.map((s) => (
          <div className="scheme-card" key={s._id}>
            <h4>{s.title}</h4>
            <p>
              <strong>Type:</strong> {s.schemeType}
            </p>

            {s.description && (
              <p>
                <strong>Description:</strong> {s.description}
              </p>
            )}

            {s.applyLink && (
              <a
                href={s.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-link"
              >
                🔗 Apply Here
              </a>
            )}

            <div className="card-actions">
              <button 
                onClick={() => startEdit(s)}
                disabled={isLoading}
              >
                Update
              </button>
              <button 
                onClick={() => deleteScheme(s._id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSchemes;