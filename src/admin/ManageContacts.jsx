import React, { useEffect, useState } from "react";
import "./ManageContacts.css";

const ManageContacts = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="no-auth">
        <p>Please login as admin</p>
      </div>
    );
  }

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // FORM STATES
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const roles = [
    "Sarpanch",
    "Upa-Sarpanch",
    "Ward Member",
    "Gram Sevak",
    "VDO",
    "Rozgar Sevak",
    "Anganwadi Worker",
    "ASHA Worker",
  ];

  // FETCH MEMBERS
  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contacts");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // PHOTO PREVIEW
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ADD MEMBER
  const addMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("phone", phone);
    formData.append("email", email);
    if (photo) formData.append("photo", photo);

    try {
      await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setName("");
      setRole("");
      setPhone("");
      setEmail("");
      setPhoto(null);
      setPhotoPreview(null);

      fetchMembers();
    } catch (err) {
      alert("Failed to add member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE MEMBER
  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSelectedMember(null);
    fetchMembers();
  };

  // UPDATE MEMBER
  const updateMember = async () => {
    await fetch(`http://localhost:5000/api/contacts/${selectedMember._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: selectedMember.name,
        role: selectedMember.role,
        phone: selectedMember.phone,
        email: selectedMember.email,
      }),
    });

    setEditMode(false);
    fetchMembers();
  };

  return (
    <div className="manage-container">
      <h1 className="page-title">Manage Gram Panchayat Contacts</h1>

      {/* ADD MEMBER FORM */}
      <form className="member-form" onSubmit={addMember}>
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handlePhotoChange} />

        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="Preview" />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span className="btn-loader"></span> : "Add Member"}
        </button>
      </form>

      {/* MEMBERS LIST */}
      <div className="member-grid">
        {members.map((m) => (
          <div className="member-card" key={m._id}>
            <img
              src={m.photo}
              alt={m.name}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/150?text=No+Image")
              }
            />
            <h4>{m.name}</h4>
            <p>{m.role}</p>
            <p>{m.phone}</p>
            <button onClick={() => setSelectedMember(m)}>View</button>
          </div>
        ))}
      </div>

      {/* VIEW / EDIT MODAL */}
      {selectedMember && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Member Details</h3>

            <input
              value={selectedMember.name}
              disabled={!editMode}
              onChange={(e) =>
                setSelectedMember({
                  ...selectedMember,
                  name: e.target.value,
                })
              }
            />

            <input
              value={selectedMember.role}
              disabled={!editMode}
              onChange={(e) =>
                setSelectedMember({
                  ...selectedMember,
                  role: e.target.value,
                })
              }
            />

            <input
              value={selectedMember.phone}
              disabled={!editMode}
              onChange={(e) =>
                setSelectedMember({
                  ...selectedMember,
                  phone: e.target.value,
                })
              }
            />

            <input
              value={selectedMember.email}
              disabled={!editMode}
              onChange={(e) =>
                setSelectedMember({
                  ...selectedMember,
                  email: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              {!editMode ? (
                <button onClick={() => setEditMode(true)}>Edit</button>
              ) : (
                <button onClick={updateMember}>Save</button>
              )}

              <button onClick={() => deleteMember(selectedMember._id)}>
                Delete
              </button>

              <button
                onClick={() => {
                  setSelectedMember(null);
                  setEditMode(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContacts;
