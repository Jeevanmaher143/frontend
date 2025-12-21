import React, { useEffect, useState } from "react";
import "./ManageGallery.css";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const token = localStorage.getItem("token");

  const fetchImages = async () => {
    const res = await fetch("http://localhost:5000/api/gallery");
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadImage = async (e) => {
    e.preventDefault();

    if (!file) return alert("Select image");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    await fetch("http://localhost:5000/api/gallery", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setFile(null);
    setCaption("");
    fetchImages();
  };

  const deleteImage = async (id) => {
    await fetch(`http://localhost:5000/api/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchImages();
  };

  return (
    <div className="manage-gallery">
      <h2>Manage Gallery</h2>

      <form onSubmit={uploadImage}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>

      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img._id} className="image-card">
            <img src={img.image} alt={img.caption} /> {/* ✅ CLOUD URL */}
            <button onClick={() => deleteImage(img._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;
