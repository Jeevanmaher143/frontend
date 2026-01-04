import React, { useEffect, useState } from "react";
import "./ManageAbout.css";

/* ✅ CLOUD BACKEND */
const API = "https://backend-9i6n.onrender.com";

const ManageAbout = () => {
  const [form, setForm] = useState({
    name: "",
    history: "",
    populationTotal: "",
    populationMale: "",
    populationFemale: "",
    area: "",
    description: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const token = localStorage.getItem("token");

  /* ================= FETCH FROM CLOUD ================= */
  useEffect(() => {
    setFetchLoading(true);
    fetch(`${API}/api/village`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
      })
      .catch((err) => console.error("Fetch village error:", err))
      .finally(() => setFetchLoading(false));
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE TO CLOUD ================= */
  const saveData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/village`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      alert("✅ Village details updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to update village details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING SKELETON ================= */
  if (fetchLoading) {
    return (
      <div className="manage-about">
        <h2>Village Information (Admin)</h2>
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-stats">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-about">
      <h2>Village Information (Admin)</h2>

      {/* ================= VIEW MODE ================= */}
      {!editMode && (
        <div className="about-card">
          <h3>{form.name || "Village Name"}</h3>
          <p className="history">{form.history || "No history available yet."}</p>

          <div className="stats">
            <div>
              👥 Total
              <b>{form.populationTotal || "N/A"}</b>
            </div>
            <div>
              👨 Male
              <b>{form.populationMale || "N/A"}</b>
            </div>
            <div>
              👩 Female
              <b>{form.populationFemale || "N/A"}</b>
            </div>
            <div>
              📐 Area
              <b>{form.area || "N/A"}</b>
            </div>
          </div>

          {form.description && <p>{form.description}</p>}

          <button className="edit-btn" onClick={() => setEditMode(true)}>
            ✏️ Edit Information
          </button>
        </div>
      )}

      {/* ================= EDIT MODE ================= */}
      {editMode && (
        <form className="about-form" onSubmit={saveData}>
          <input
            name="name"
            placeholder="Village Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="history"
            placeholder="Village History"
            value={form.history}
            onChange={handleChange}
            required
          />

          <input
            name="populationTotal"
            type="number"
            placeholder="Total Population"
            value={form.populationTotal}
            onChange={handleChange}
            required
          />

          <input
            name="populationMale"
            type="number"
            placeholder="Male Population"
            value={form.populationMale}
            onChange={handleChange}
            required
          />

          <input
            name="populationFemale"
            type="number"
            placeholder="Female Population"
            value={form.populationFemale}
            onChange={handleChange}
            required
          />

          <input
            name="area"
            placeholder="Area (sq km)"
            value={form.area}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Extra Description (Optional)"
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? (
                <div className="btn-loader"></div>
              ) : (
                "💾 Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageAbout;