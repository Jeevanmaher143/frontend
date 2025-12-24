import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  // STATIC SERVICES DATA (can be DB later)
  const services = [
    {
      id: 1,
      title: "Birth Certificate",
     
      description:
        "Apply for official birth certificate issued by Gram Panchayat.",
      documents: ["Hospital slip", "Parents Aadhaar", "Address proof"],
    },
    {
      id: 2,
      title: "Death Certificate",
     
      description: "Apply for death certificate for official records.",
      documents: ["Hospital slip", "Aadhaar of deceased", "Applicant ID"],
    },
    {
      id: 3,
      title: "Income Certificate",
      
      description: "Certificate for income proof for schemes & education.",
      documents: ["Aadhaar card", "Ration card", "Income proof"],
    },
    {
      id: 4,
      title: "Residence Certificate",
      
      description: "Proof of residence for government services.",
      documents: ["Aadhaar card", "Electricity bill", "Ration card"],
    },
    {
      id: 6,
      title: "Marriage Certificate",
      description: "Legal marriage registration certificate.",
      documents: ["Age proof", "Address proof", "Marriage invitation", "Photos"],
    },
  ];

  return (
    <div className="services-page">
      <div className="services-header">
        <h2 className="services-title">Gram Panchayat Services</h2>
        <p className="services-subtitle">
          Apply for various certificates and services online
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="service-icon">{service.icon}</div>
            
            <h3>{service.title}</h3>
            <p className="desc">{service.description}</p>

            <div className="docs">
              <h4>Required Documents</h4>
              <ul>
                {service.documents.map((doc, index) => (
                  <li key={index}>
                    <span>✓</span> {doc}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="apply-btn"
              onClick={() =>
                navigate(
                  `/apply-service?service=${encodeURIComponent(service.title)}`
                )
              }
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;