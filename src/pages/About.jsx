import React, { useEffect, useState } from "react";
import "./About.css";

const API = process.env.REACT_APP_API_URL;

const About = () => {
  const [village, setVillage] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/village`)
      .then((res) => res.json())
      .then((data) => setVillage(data))
      .catch((err) => {
        console.error("Failed to fetch village data", err);
      });
  }, []);

  if (!village) {
    return <p className="loading">Loading village information...</p>;
  }

  return (
    <div className="about-page">
      {/* HEADER */}
      <div className="about-header">
        <h1>Welcome to {village.name}</h1>
        <p className="slogan">
          “Clean Village • Strong Community • Bright Future”
        </p>
      </div>

      {/* HISTORY */}
      <div className="about-section">
        <h2>🏡 Village History</h2>
        <p className="history">{village.history}</p>
      </div>

      {/* STATISTICS */}
      <div className="about-section">
        <h2>📊 Village Statistics</h2>
        <div className="stats">
          <div className="stat-card">
            <span>👥</span>
            <h3>{village.populationTotal}</h3>
            <p>Total Population</p>
          </div>

          <div className="stat-card">
            <span>👨</span>
            <h3>{village.populationMale}</h3>
            <p>Male</p>
          </div>

          <div className="stat-card">
            <span>👩</span>
            <h3>{village.populationFemale}</h3>
            <p>Female</p>
          </div>

          <div className="stat-card">
            <span>📐</span>
            <h3>{village.area}</h3>
            <p>Area (sq km)</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      {village.description && (
        <div className="about-section">
          <h2>🌱 About Our Village</h2>
          <p className="desc">{village.description}</p>
        </div>
      )}

      {/* VISION */}
      <div className="about-section vision">
        <h2>🎯 Our Vision</h2>
        <ul>
          <li>✔ Transparent and digital governance</li>
          <li>✔ Clean and green village environment</li>
          <li>✔ Quality education and healthcare</li>
          <li>✔ Strong rural development and employment</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
