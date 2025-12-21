import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./ApplyService.css";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
    dateOfDeath: ""
  });

  const [files, setFiles] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, serviceType: selectedService }));
    }
  }, [selectedService]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      showToast("File size must be less than 2MB", "error");
      e.target.value = "";
      return;
    }
    setFiles({ ...files, [e.target.name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    Object.keys(files).forEach((key) => {
      data.append(key, files[key]);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/services/apply",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      showToast(res.data.message || "Application submitted successfully! ✅", "success");
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          serviceType: selectedService || "",
          fullName: "",
          address: "",
          mobile: "",
          deceasedName: "",
          dateOfDeath: ""
        });
        setFiles({});
      }, 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Submission failed! ❌", "error");
    }
  };

  return (
    <div className="apply-service-container">
      <h2>Apply for Service</h2>

      {/* TOAST MESSAGE */}
      {toast.show && (
        <div className={`toast-overlay ${toast.show ? 'show' : ''}`}>
          <div className={`toast ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === "success" ? "✅" : "❌"}
            </div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />

        {/* BIRTH CERTIFICATE */}
        {formData.serviceType === "Birth Certificate" && (
          <>
            <h4>Required Documents</h4>
            <input type="file" name="hospitalSlip" onChange={handleFileChange} required />
            <small>Hospital Slip (max 2MB)</small>

            <input type="file" name="parentsAadhaar" onChange={handleFileChange} required />
            <small>Parents Aadhaar (max 2MB)</small>

            <input type="file" name="addressProof" onChange={handleFileChange} required />
            <small>Address Proof (max 2MB)</small>
          </>
        )}

        {/* DEATH CERTIFICATE */}
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
            <small>Hospital Death Slip (max 2MB)</small>

            <input type="file" name="deceasedAadhaar" onChange={handleFileChange} required />
            <small>Aadhaar of Deceased (max 2MB)</small>

            <input type="file" name="applicantAadhaar" onChange={handleFileChange} required />
            <small>Aadhaar of Applicant (max 2MB)</small>

            <input type="file" name="addressProof" onChange={handleFileChange} required />
            <small>Address Proof (max 2MB)</small>
          </>
        )}

        {/* INCOME CERTIFICATE */}
        {formData.serviceType === "Income Certificate" && (
          <>
            <h4>Required Documents</h4>
            <input type="file" name="aadhaar" onChange={handleFileChange} required />
            <small>Aadhaar Card (max 2MB)</small>

            <input type="file" name="rationCard" onChange={handleFileChange} required />
            <small>Ration Card (max 2MB)</small>

            <input type="file" name="incomeProof" onChange={handleFileChange} required />
            <small>Income Proof (max 2MB)</small>
          </>
        )}

        {/* RESIDENCE CERTIFICATE */}
        {formData.serviceType === "Residence Certificate" && (
          <>
            <h4>Required Documents</h4>
            <input type="file" name="aadhaar" onChange={handleFileChange} required />
            <small>Aadhaar Card (max 2MB)</small>

            <input type="file" name="electricityBill" onChange={handleFileChange} required />
            <small>Electricity Bill (max 2MB)</small>

            <input type="file" name="rationCard" onChange={handleFileChange} required />
            <small>Ration Card (max 2MB)</small>
          </>
        )}

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplyService;