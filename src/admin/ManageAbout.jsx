import React, { useEffect, useState } from "react";
import "./ManageAbout.css";

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/village")
      .then((res) => res.json())
      .then((data) => data && setForm(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveData = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/village", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    alert("Village details updated");
    setEditMode(false);
  };

  return (
    <div className="manage-about">
      <h2>Village Information (Admin)</h2>

      {/* VIEW MODE */}
      {!editMode && (
        <div className="about-card">
          <h3>{form.name}</h3>
          <p className="history">{form.history}</p>

          <div className="stats">
            <div>👥 Total: <b>{form.populationTotal}</b></div>
            <div>👨 Male: <b>{form.populationMale}</b></div>
            <div>👩 Female: <b>{form.populationFemale}</b></div>
            <div>📐 Area: <b>{form.area}</b></div>
          </div>

          {form.description && <p>{form.description}</p>}

          <button className="edit-btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <form className="about-form" onSubmit={saveData}>
          <input name="name" placeholder="Village Name" value={form.name} onChange={handleChange} />
          <textarea name="history" placeholder="Village History" value={form.history} onChange={handleChange} />
          <input name="populationTotal" placeholder="Total Population" value={form.populationTotal} onChange={handleChange} />
          <input name="populationMale" placeholder="Male Population" value={form.populationMale} onChange={handleChange} />
          <input name="populationFemale" placeholder="Female Population" value={form.populationFemale} onChange={handleChange} />
          <input name="area" placeholder="Area (sq km)" value={form.area} onChange={handleChange} />
          <textarea name="description" placeholder="Extra Description" value={form.description} onChange={handleChange} />

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageAbout;
