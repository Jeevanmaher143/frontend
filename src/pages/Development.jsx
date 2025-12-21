import React, { useEffect, useState } from "react";
import "./Development.css";

const Development = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/development");
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching development:", err);
        setError("Unable to load development projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // STATUS COLOR
  const getStatusColor = (status) => {
    const map = {
      completed: "status-completed",
      ongoing: "status-progress",
      "in-progress": "status-progress",
      planned: "status-planned",
    };
    return map[status?.toLowerCase()] || "status-default";
  };

  // PROGRESS COLOR
  const getProgressColor = (progress) => {
    if (progress >= 75) return "progress-high";
    if (progress >= 40) return "progress-medium";
    return "progress-low";
  };

  // FILTER
  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.status?.toLowerCase() === filter;
  });

  // LOADING
  if (loading) {
    return (
      <div className="dev-container">
        <div className="dev-loading">
          <div className="spinner"></div>
          <p>Loading development projects...</p>
        </div>
      </div>
    );
  }

  // ERROR
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
          <h1 className="dev-title">Village Development</h1>
          <p className="dev-subtitle">
            Track progress of ongoing development projects
          </p>

          {/* STATS */}
          <div className="dev-stats">
            <div className="stat-card">
              <h3>{projects.length}</h3>
              <p>Total Projects</p>
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
              <p>In Progress</p>
            </div>

            <div className="stat-card">
              <h3>
                {
                  projects.filter(
                    (p) => p.status?.toLowerCase() === "completed"
                  ).length
                }
              </h3>
              <p>Completed</p>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "ongoing" ? "filter-btn active" : "filter-btn"
              }
              onClick={() => setFilter("ongoing")}
            >
              In Progress
            </button>

            <button
              className={
                filter === "completed" ? "filter-btn active" : "filter-btn"
              }
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {/* PROJECT LIST */}
        {filteredProjects.length === 0 ? (
          <p className="no-data">No projects available</p>
        ) : (
          <div className="dev-grid">
            {filteredProjects.map((project) => (
              <div className="dev-card" key={project._id}>
                {/* HEADER */}
                <div className="card-header">
                  <h3>{project.projectName}</h3>
                  <span
                    className={`status-badge ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="project-description">
                  {project.description}
                </p>

                {/* PROGRESS */}
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressColor(
                        project.progress
                      )}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* FUNDS */}
                <p className="funds-used">
                  <b>Funds Used:</b> ₹
                  {project.fundsUsed
                    ? project.fundsUsed.toLocaleString()
                    : "N/A"}
                </p>

                {/* ✅ CLOUDINARY IMAGES */}
                {project.images && project.images.length > 0 && (
                  <div className="dev-images">
                    <h4>Project Photos</h4>

                    <div className="images-grid">
                      {project.images.map((img, index) => (
                        <div className="image-wrapper" key={index}>
                          <img
                            src={img} 
                            alt={`${project.projectName} ${index + 1}`}
                            loading="lazy"
                          />
                        </div>
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
