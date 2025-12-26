import React, { useEffect, useState } from "react";
import "./About.css";

const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const About = () => {
  const [village, setVillage] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/village`)
      .then((res) => res.json())
      .then((data) => setVillage(data))
      .catch((err) => {
        console.error("गावाची माहिती मिळवण्यात अडचण आली", err);
      });
  }, []);

  if (!village) {
    return <p className="loading">गावाची माहिती लोड होत आहे...</p>;
  }

  return (
    <div className="about-page">
      {/* HEADER */}
      <div className="about-header">
        <h1>{village.name} येथे आपले स्वागत आहे</h1>
        <p className="slogan">
          स्वच्छ गाव • सशक्त समाज • उज्वल भविष्य
        </p>
      </div>

      {/* HISTORY */}
      <div className="about-section">
        <h2>गावाचा इतिहास</h2>
        <p className="history">{village.history}</p>
      </div>

      {/* STATISTICS */}
      <div className="about-section">
        <h2>गावाची सांख्यिकी माहिती</h2>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <h3>{village.populationTotal}</h3>
            <p>एकूण लोकसंख्या</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🧍‍♂️</span>
            <h3>{village.populationMale}</h3>
            <p>पुरुष</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🧍‍♀️</span>
            <h3>{village.populationFemale}</h3>
            <p>महिला</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🌍</span>
            <h3>{village.area}</h3>
            <p>क्षेत्रफळ (चौ.कि.मी.)</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      {village.description && (
        <div className="about-section">
          <h2>आमच्या गावाबद्दल</h2>
          <p className="desc">{village.description}</p>
        </div>
      )}

      {/* VISION */}
      <div className="about-section vision">
        <h2>आमचे ध्येय</h2>
        <ul>
          <li>पारदर्शक व डिजिटल प्रशासन</li>
          <li>स्वच्छ व हरित गाव वातावरण</li>
          <li>दर्जेदार शिक्षण व आरोग्य सेवा</li>
          <li>सशक्त ग्रामीण विकास व रोजगार</li>
        </ul>
      </div>
    </div>
  );
};

export default About;