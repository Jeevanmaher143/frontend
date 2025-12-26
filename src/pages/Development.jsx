import React, { useEffect, useState } from "react";
import "./Development.css";

const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const Development = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API}/api/development`);
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("विकासकामे मिळवताना त्रुटी आली:", err);
        setError("विकास प्रकल्प लोड करता आले नाहीत");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ================= HELPERS ================= */
  const getStatusColor = (status) => {
    const map = {
      completed: "status-completed",
      ongoing: "status-progress",
      "in-progress": "status-progress",
      planned: "status-planned",
    };
    return map[status?.toLowerCase()] || "status-default";
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "progress-high";
    if (progress >= 40) return "progress-medium";
    return "progress-low";
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.status?.toLowerCase() === filter;
  });

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="dev-container">
        <div className="dev-loading">
          <div className="spinner"></div>
          <p>विकास प्रकल्प लोड होत आहेत...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="dev-container">
        <div className="dev-error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-container">
      <div className="dev-content">

        {/* HEADER */}
        <div className="dev-header">
          <h1 className="dev-title">गाव विकास कामे</h1>
          <p className="dev-subtitle">
            चालू असलेल्या व पूर्ण झालेल्या विकास प्रकल्पांची माहिती
          </p>

          {/* STATS */}
          <div className="dev-stats">
            <div className="stat-card">
              <h3>{projects.length}</h3>
              <p>एकूण प्रकल्प</p>
            </div>

            <div className="stat-card">
              <h3>
                {
                  projects.filter(
                    (p) =>
                      p.status?.toLowerCase() === "ongoing" ||
                      p.status?.toLowerCase() === "in-progress"
                  ).length
                }
              </h3>
              <p>प्रगतीपथावर</p>
            </div>

            <div className="stat-card">
              <h3>
                {
                  projects.filter(
                    (p) => p.status?.toLowerCase() === "completed"
                  ).length
                }
              </h3>
              <p>पूर्ण झालेले</p>
            </div>
          </div>

          {/* FILTER */}
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("all")}
            >
              सर्व
            </button>

            <button
              className={filter === "ongoing" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("ongoing")}
            >
              प्रगतीपथावर
            </button>

            <button
              className={filter === "completed" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("completed")}
            >
              पूर्ण झालेले
            </button>
          </div>
        </div>

        {/* PROJECTS */}
        {filteredProjects.length === 0 ? (
          <p className="no-data">कोणतेही विकास प्रकल्प उपलब्ध नाहीत</p>
        ) : (
          <div className="dev-grid">
            {filteredProjects.map((project) => (
              <div className="dev-card" key={project._id}>
                <div className="card-header">
                  <h3>{project.projectName}</h3>
                  <span
                    className={`status-badge ${getStatusColor(project.status)}`}
                  >
                    {project.status === "completed"
                      ? "पूर्ण"
                      : project.status === "ongoing" ||
                        project.status === "in-progress"
                      ? "प्रगतीपथावर"
                      : "नियोजित"}
                  </span>
                </div>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>प्रगती</span>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <p className="funds-used">
                  <b>वापरलेला निधी:</b> ₹
                  {project.fundsUsed
                    ? project.fundsUsed.toLocaleString()
                    : "माहिती उपलब्ध नाही"}
                </p>

                {/* IMAGES */}
                {project.images?.length > 0 && (
                  <div className="dev-images">
                    <h4>प्रकल्पाचे फोटो</h4>
                    <div className="images-grid">
                      {project.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${project.projectName} ${i + 1}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Development;
