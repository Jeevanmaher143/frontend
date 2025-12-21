import React, { useEffect, useState } from "react";
import "./ManageSchemes.css";

const ManageSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [editingId, setEditingId] = useState(null);

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

  const fetchSchemes = async () => {
    const res = await fetch("http://localhost:5000/api/schemes");
    const data = await res.json();
    setSchemes(data);
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD OR UPDATE
  const submitScheme = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/api/schemes/${editingId}`
      : "http://localhost:5000/api/schemes";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchSchemes();
  };

  // ✅ START EDIT
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
  };

  // ✅ DELETE
  const deleteScheme = async (id) => {
    await fetch(`http://localhost:5000/api/schemes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchSchemes();
  };

  // ✅ RESET FORM
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

      {/* FORM */}

      <form className="scheme-form" onSubmit={submitScheme}>
        <h3 className="schemedata">Enter Scheme Data</h3>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <textarea
          name="benefits"
          placeholder="Benefits"
          value={form.benefits}
          onChange={handleChange}
        />

        <textarea
          name="eligibility"
          placeholder="Eligibility"
          value={form.eligibility}
          onChange={handleChange}
        />

        <textarea
          name="applyProcess"
          placeholder="Apply Process"
          value={form.applyProcess}
          onChange={handleChange}
        />

        <input
          type="url"
          name="applyLink"
          placeholder="Apply Link (https://...)"
          value={form.applyLink}
          onChange={handleChange}
        />

        <select
          name="schemeType"
          value={form.schemeType}
          onChange={handleChange}
        >
          <option value="Central">Central</option>
          <option value="State">State</option>
        </select>

        <div className="form-actions">
          <button type="submit">
            {editingId ? "Update Scheme" : "Add Scheme"}
          </button>

          {editingId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
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
              <button onClick={() => startEdit(s)}>Update</button>
              <button onClick={() => deleteScheme(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSchemes;
