import React, { useEffect, useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then(setImages)
      .catch(console.error);
  }, []);

  return (
    <div className="gallery-page">
      <h2>Village Gallery</h2>

      <div className="gallery-grid">
        {images.map((img) => (
          <img
            key={img._id}
            src={img.image}         
            alt={img.caption || "Gallery Image"}
            className="gallery-img"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
