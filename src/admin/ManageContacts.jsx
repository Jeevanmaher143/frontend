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

  // form states
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
    "ASHA Worker"
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

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ADD MEMBER
  const addMember = async (e) => {
    e.preventDefault();

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
      console.error("Add member failed", err);
    }
  };

  // DELETE MEMBER
  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

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
      <div className="page-header">
        <h1 className="page-title">Manage Contacts</h1>
        <p className="page-subtitle">Add and manage Gram Panchayat team members</p>
      </div>

      {/* ADD MEMBER FORM */}
      <div className="form-card">
        <h2 className="form-title">Add New Member</h2>
        <form className="member-form" onSubmit={addMember}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group photo-upload">
            <label htmlFor="photo">Profile Photo</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Add Member
          </button>
        </form>
      </div>

      {/* MEMBERS LIST */}
      <div className="members-section">
        <h2 className="section-title">Team Members ({members.length})</h2>
        <div className="member-grid">
          {members.map((m) => (
            <div className="member-card" key={m._id}>
              <div className="member-photo">
                <img 
                  // src={`http://localhost:5000${m.photo}`} 
                  // alt={m.name}
                   src={m.photo} alt={m.name}

                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">{m.name}</h3>
                <p className="member-role">{m.role}</p>
                <p className="member-phone">{m.phone}</p>
              </div>
              <button 
                className="view-btn" 
                onClick={() => setSelectedMember(m)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW / EDIT MODAL */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => {
          setSelectedMember(null);
          setEditMode(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Member Details</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setSelectedMember(null);
                  setEditMode(false);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-photo">
                <img
                  //src={`http://localhost:5000${selectedMember.photo}`}
                  src={selectedMember.photo}
                  className="modal-img"
                  //alt={selectedMember.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              </div>

              <div className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={selectedMember.name}
                    disabled={!editMode}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  {editMode ? (
                    <select
                      value={selectedMember.role}
                      onChange={(e) =>
                        setSelectedMember({ ...selectedMember, role: e.target.value })
                      }
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedMember.role}
                      disabled
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={selectedMember.phone}
                    disabled={!editMode}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={selectedMember.email}
                    disabled={!editMode}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              {!editMode ? (
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit
                </button>
              ) : (
                <button className="save-btn" onClick={updateMember}>
                  Save Changes
                </button>
              )}

              <button
                className="delete-btn"
                onClick={() => deleteMember(selectedMember._id)}
              >
                Delete
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedMember(null);
                  setEditMode(false);
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

export default ManageContacts;