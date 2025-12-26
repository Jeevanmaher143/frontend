import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  // स्थिर सेवा माहिती (नंतर DB मधून घेता येईल)
  const services = [
    {
      id: 1,
      title: "जन्म प्रमाणपत्र",
      description:
        "ग्राम पंचायत कडून दिले जाणारे अधिकृत जन्म प्रमाणपत्र मिळवण्यासाठी अर्ज करा.",
      documents: ["रुग्णालयाची पावती", "पालकांचे आधार कार्ड", "पत्ता पुरावा"],
    },
    {
      id: 2,
      title: "मृत्यू प्रमाणपत्र",
      description:
        "अधिकृत नोंदींसाठी मृत्यू प्रमाणपत्र मिळवण्यासाठी अर्ज करा.",
      documents: ["रुग्णालयाची पावती", "मृत व्यक्तीचे आधार कार्ड", "अर्जदाराचा ओळखपत्र"],
    },
    {
      id: 3,
      title: "उत्पन्न प्रमाणपत्र",
      description:
        "शासकीय योजना व शिक्षणासाठी उत्पन्नाचा पुरावा म्हणून प्रमाणपत्र.",
      documents: ["आधार कार्ड", "रेशन कार्ड", "उत्पन्नाचा पुरावा"],
    },
    {
      id: 4,
      title: "रहिवासी प्रमाणपत्र",
      description:
        "शासकीय सेवांसाठी रहिवासाचा पुरावा म्हणून प्रमाणपत्र.",
      documents: ["आधार कार्ड", "वीज बिल", "रेशन कार्ड"],
    },
    {
      id: 6,
      title: "विवाह प्रमाणपत्र",
      description:
        "कायदेशीर विवाह नोंदणीसाठी विवाह प्रमाणपत्र.",
      documents: ["वयाचा पुरावा", "पत्ता पुरावा", "लग्न पत्रिका", "छायाचित्रे"],
    },
  ];

  return (
    <div className="services-page">
      <div className="services-header">
        <h2 className="services-title">ग्राम पंचायत सेवा</h2>
        <p className="services-subtitle">
          विविध प्रमाणपत्रे व सेवांसाठी ऑनलाइन अर्ज करा
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="service-icon">{service.icon}</div>

            <h3>{service.title}</h3>
            <p className="desc">{service.description}</p>

            <div className="docs">
              <h4>आवश्यक कागदपत्रे</h4>
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
              अर्ज करा
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
