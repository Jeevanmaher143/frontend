import React, { useEffect, useState } from "react";
import "./ManageGallery.css";

/* ✅ CLOUD BACKEND */
const API = "https://backend-9i6n.onrender.com";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== POPUP ===== */
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const token = localStorage.getItem("token");

  /* ===== POPUP HANDLER ===== */
  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 500);
  };

  /* ===== FETCH IMAGES ===== */
  const fetchImages = async () => {
    try {
      const res = await fetch(`${API}/api/gallery`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      showPopup("Failed to load gallery ❌", "error");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ===== UPLOAD IMAGE ===== */
  const uploadImage = async (e) => {
    e.preventDefault();

    if (!file) {
      showPopup("Please select an image", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await fetch(`${API}/api/gallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setFile(null);
      setCaption("");
      fetchImages();
      showPopup("Image uploaded successfully ✅", "success");
    } catch {
      showPopup("Upload failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ===== DELETE IMAGE ===== */
  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await fetch(`${API}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchImages();
      showPopup("Image deleted successfully 🗑️", "success");
    } catch {
      showPopup("Delete failed ❌", "error");
    }
  };

  return (
    <div className="manage-gallery">
      <h2>Manage Gallery</h2>

      {/* ===== UPLOAD FORM ===== */}
      <form onSubmit={uploadImage} className="gallery-form">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? <span className="btn-loader"></span> : "Upload"}
        </button>
      </form>

      {/* ===== GALLERY GRID ===== */}
      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img._id} className="image-card">
            <img src={img.image} alt={img.caption || "Gallery"} />
            <p>{img.caption}</p>
            <button onClick={() => deleteImage(img._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* ===== CENTER POPUP ===== */}
      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup ${popup.type}`}>
            {popup.type === "success" ? "✅" : "❌"}
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
