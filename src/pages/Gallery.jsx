import React, { useEffect, useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleImages, setVisibleImages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    fetch(
      `${
        process.env.REACT_APP_API_URL ||
        "https://backend-9i6n.onrender.com"
      }/api/gallery`
    )
      .then((res) => res.json())
      .then((data) => {
        const imageData = Array.isArray(data) ? data : [];
        setImages(imageData);
        setVisibleImages(imageData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const cards = document.querySelectorAll(".gallery-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [visibleImages]);

  const categories = [
    "all",
    ...new Set(images.map((img) => img.category).filter(Boolean)),
  ];

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setVisibleImages(images);
    } else {
      setVisibleImages(images.filter((img) => img.category === category));
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateLightbox = (direction) => {
    const currentIndex = visibleImages.findIndex(
      (img) => img._id === selectedImage._id
    );
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % visibleImages.length;
    } else {
      newIndex =
        currentIndex - 1 < 0
          ? visibleImages.length - 1
          : currentIndex - 1;
    }

    setSelectedImage(visibleImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-loading">
          <div className="spinner"></div>
          <p>गॅलरी लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        {/* Header */}
        <header className="gallery-header">
          <div className="header-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="gallery-title">गावाची गॅलरी</h1>
          <p className="gallery-subtitle">
            आमच्या गावातील सुंदर क्षण आणि आठवणी पहा
          </p>
          <div className="gallery-count">
            <span>{visibleImages.length} फोटो</span>
          </div>
        </header>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => filterByCategory(category)}
              >
                {category === "all" ? "सर्व" : category}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {visibleImages.length === 0 && (
          <div className="gallery-empty">
            <p>या विभागात कोणतेही फोटो उपलब्ध नाहीत</p>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {visibleImages.map((img, index) => (
            <div
              key={img._id}
              className="gallery-card"
              onClick={() => openLightbox(img)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="image-wrapper">
                <img
                  src={img.image}
                  alt={img.caption || "गॅलरी फोटो"}
                  loading="lazy"
                />
              </div>
              <div className="card-info">
                {img.caption && (
                  <h3 className="image-caption">{img.caption}</h3>
                )}
                {img.category && (
                  <span className="image-category">{img.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            ✕
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.caption}
            />
            {(selectedImage.caption || selectedImage.category) && (
              <div className="lightbox-info">
                {selectedImage.caption && (
                  <h3>{selectedImage.caption}</h3>
                )}
                {selectedImage.category && (
                  <p>{selectedImage.category}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
