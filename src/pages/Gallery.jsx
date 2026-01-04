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

  // Intersection Observer for lazy load animations
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

  // Get unique categories
  const categories = ["all", ...new Set(images.map((img) => img.category).filter(Boolean))];

  // Filter images by category
  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setVisibleImages(images);
    } else {
      setVisibleImages(images.filter((img) => img.category === category));
    }
  };

  // Lightbox navigation
  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateLightbox = (direction) => {
    const currentIndex = visibleImages.findIndex((img) => img._id === selectedImage._id);
    let newIndex;
    
    if (direction === "next") {
      newIndex = (currentIndex + 1) % visibleImages.length;
    } else {
      newIndex = currentIndex - 1 < 0 ? visibleImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(visibleImages[newIndex]);
  };

  // Keyboard navigation
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

  // Loading State
  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-loading">
          <div className="spinner"></div>
          <p>Loading Gallery...</p>
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
          <h1 className="gallery-title">Village Gallery</h1>
          <p className="gallery-subtitle">
            Explore the beautiful moments and memories captured from our vibrant village community
          </p>
          <div className="gallery-count">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{visibleImages.length} Photos</span>
          </div>
        </header>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => filterByCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {visibleImages.length === 0 && (
          <div className="gallery-empty">
            <div className="empty-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p>No images found in this category</p>
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
                  alt={img.caption || "Gallery Image"}
                  loading="lazy"
                />
                <div className="image-overlay">
                  <svg className="zoom-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>
              <div className="card-info">
                {img.caption && (
                  <h3 className="image-caption">{img.caption}</h3>
                )}
                {img.category && (
                  <span className="image-category">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {img.category}
                  </span>
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
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {visibleImages.length > 1 && (
            <>
              <button
                className="lightbox-nav lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("prev");
                }}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                className="lightbox-nav lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("next");
                }}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.image} alt={selectedImage.caption} />
            {(selectedImage.caption || selectedImage.category) && (
              <div className="lightbox-info">
                {selectedImage.caption && <h3>{selectedImage.caption}</h3>}
                {selectedImage.category && <p>{selectedImage.category}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;