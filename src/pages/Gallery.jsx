import React, { useEffect, useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetch(
      `${
        process.env.REACT_APP_API_URL ||
        "https://backend-9i6n.onrender.com"
      }/api/gallery`
    )
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="gallery-page">
      <h2>Village Gallery</h2>

      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img._id} className="gallery-card">
            <img
              src={img.image}
              alt={img.caption || "Gallery Image"}
              className="gallery-img"
              loading="lazy"
            />

            {/* ✅ ONE LINE CAPTION */}
            {img.caption && (
              <p className="gallery-caption">{img.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
