import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./ApplyService.css";

const API =
  process.env.REACT_APP_API_URL ||
  "https://backend-9i6n.onrender.com";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ApplyService = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const selectedService = query.get("service");

  const [formData, setFormData] = useState({
    serviceType: "",
    fullName: "",
    address: "",
    mobile: "",
    deceasedName: "",
    dateOfDeath: "",
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  /* ================= PREFILL SERVICE ================= */
  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        serviceType: selectedService,
      }));
    }
  }, [selectedService]);

  /* ================= TOAST ================= */
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2000);
  };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= FILE ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > MAX_FILE_SIZE) {
      showToast("File size must be less than 5MB", "error");
      e.target.value = "";
      return;
    }

    setFiles({ ...files, [e.target.name]: file });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );

    Object.entries(files).forEach(([key, file]) =>
      data.append(key, file)
    );

    try {
      const res = await axios.post(
        `${API}/api/services/apply`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast(
        res.data.message || "Application submitted successfully ✅",
        "success"
      );

      setTimeout(() => {
        setFormData({
          serviceType: selectedService || "",
          fullName: "",
          address: "",
          mobile: "",
          deceasedName: "",
          dateOfDeath: "",
        });
        setFiles({});
      }, 1500);
    } catch (err) {
      console.error("Apply service error:", err);
      showToast(
        err.response?.data?.message || "Submission failed ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-service-container">
      <h2>Apply for Service</h2>

      {/* TOAST */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* SERVICE */}
        <label>Service</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          disabled={!!selectedService}
          required
        >
          <option value="">Select Service</option>
          <option value="Birth Certificate">Birth Certificate</option>
          <option value="Death Certificate">Death Certificate</option>
          <option value="Income Certificate">Income Certificate</option>
          <option value="Residence Certificate">Residence Certificate</option>
        </select>

        {/* APPLICANT */}
        <h4>Applicant Details</h4>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        {/* ================= BIRTH ================= */}
        {formData.serviceType === "Birth Certificate" && (
          <>
            <h4>Required Documents</h4>
            <input type="file" name="hospitalSlip" onChange={handleFileChange} required />
            <input type="file" name="parentsAadhaar" onChange={handleFileChange} required />
            <input type="file" name="addressProof" onChange={handleFileChange} required />
          </>
        )}

        {/* ================= DEATH ================= */}
        {formData.serviceType === "Death Certificate" && (
          <>
            <h4>Deceased Details</h4>
            <input
              name="deceasedName"
              placeholder="Deceased Name"
              value={formData.deceasedName}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dateOfDeath"
              value={formData.dateOfDeath}
              onChange={handleChange}
              required
            />

            <h4>Required Documents</h4>
            <input type="file" name="hospitalDeathSlip" onChange={handleFileChange} required />
            <input type="file" name="deceasedAadhaar" onChange={handleFileChange} required />
            <input type="file" name="applicantAadhaar" onChange={handleFileChange} required />
            <input type="file" name="addressProof" onChange={handleFileChange} required />
          </>
        )}

        {/* ================= INCOME ================= */}
        {formData.serviceType === "Income Certificate" && (
          <>
            <h4>Required Documents</h4>
            <input type="file" name="aadhaar" onChange={handleFileChange} required />
            <input type="file" name="rationCard" onChange={handleFileChange} required />
            <input type="file" name="incomeProof" onChange={handleFileChange} required />
          </>
        )}

        {/* ================= RESIDENCE ================= */}
        {formData.serviceType === "Residence Certificate" && (
          <>
            <h4>Required Documents</h4>
            <input type="file" name="aadhaar" onChange={handleFileChange} required />
            <input type="file" name="electricityBill" onChange={handleFileChange} required />
            <input type="file" name="rationCard" onChange={handleFileChange} required />
          </>
        )}

        {/* SUBMIT */}
        <button type="submit" disabled={loading}>
          {loading ? <span className="btn-loader"></span> : "Submit Application"}
        </button>
        {/* CENTER SUCCESS / ERROR POPUP */}
{toast.show && (
  <div className="popup-overlay">
    <div className={`popup ${toast.type}`}>
      <div className="popup-icon">
        {toast.type === "success" ? "✅" : "❌"}
      </div>
      <p className="popup-message">{toast.message}</p>
    </div>
  </div>
)}

      </form>
    </div>
  );
};

export default ApplyService;
