import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <div className="hero-container">
      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        alt="Village"
        className="hero-image"
      />

      <div className="hero-overlay">
        <h1>Digital Gram Panchayat</h1>
        <h2> Palshi</h2>
        <p>
          Welcome to the official portal of Palshi Gram Panchayat.  
          Serving citizens with transparency and technology.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
