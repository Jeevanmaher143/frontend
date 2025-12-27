import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./ApplyService.css";

const API =
  process.env.REACT_APP_API_URL || "https://backend-9i6n.onrender.com";

// MAX FILE SIZE = 500 KB
const MAX_FILE_SIZE = 500 * 1024;

const ApplyService = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  const [formData, setFormData] = useState({
    serviceType: "",
    fullName: "",
    address: "",
    mobile: "",
    deceasedName: "",
    dateOfDeath: "",
  });

  const [files, setFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* PREFILL SERVICE */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceFromUrl = params.get("service");
    if (serviceFromUrl) {
      setFormData((p) => ({ ...p, serviceType: serviceFromUrl }));
    }
  }, [location.search]);

  /* INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* FILE VALIDATION */
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileErrors((p) => ({
        ...p,
        [name]: "फक्त JPG,JPEG, PNG  फाईल अपलोड करा",
      }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((p) => ({
        ...p,
        [name]: "फाईलचा आकार 500 KB पेक्षा जास्त नसावा",
      }));
      e.target.value = "";
      return;
    }

    setFileErrors((p) => ({ ...p, [name]: "" }));
    setFiles((p) => ({ ...p, [name]: file }));
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    Object.entries(files).forEach(([k, f]) => data.append(k, f));

    try {
      await axios.post(`${API}/api/services/apply`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("अर्ज यशस्वीरीत्या सादर झाला ✅");
      setFormData({
        serviceType: "",
        fullName: "",
        address: "",
        mobile: "",
        deceasedName: "",
        dateOfDeath: "",
      });
      setFiles({});
      setFileErrors({});
    } catch {
      alert("अर्ज सादर होऊ शकला नाही ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-service-container">
      <h2>सेवेसाठी अर्ज करा</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* SERVICE */}
        <label>सेवा निवडा</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
        >
          <option value="">-- सेवा निवडा --</option>
          <option value="जन्म प्रमाणपत्र">जन्म प्रमाणपत्र</option>
          <option value="मृत्यू प्रमाणपत्र">मृत्यू प्रमाणपत्र</option>
          <option value="उत्पन्न प्रमाणपत्र">उत्पन्न प्रमाणपत्र</option>
          <option value="रहिवासी प्रमाणपत्र">रहिवासी प्रमाणपत्र</option>
          <option value="विवाह प्रमाणपत्र">विवाह प्रमाणपत्र</option>
        </select>

        {/* APPLICANT */}
        <h4>अर्जदाराची माहिती</h4>
        <input
          name="fullName"
          placeholder="पूर्ण नाव"
          required
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="पत्ता"
          required
          onChange={handleChange}
        />
        <input
          name="mobile"
          placeholder="मोबाईल क्रमांक"
          required
          onChange={handleChange}
        />

        {/* ================= जन्म प्रमाणपत्र ================= */}
        {formData.serviceType === "जन्म प्रमाणपत्र" && (
          <>
            <h4>आवश्यक कागदपत्रे</h4>

            <label>🏥 रुग्णालयाची पावती</label>
            <input
              type="file"
              name="hospitalSlip"
              onChange={handleFileChange}
              required
            />
            {fileErrors.hospitalSlip && (
              <p className="file-error">{fileErrors.hospitalSlip}</p>
            )}

            <label>🆔 पालकांचे आधार कार्ड</label>
            <input
              type="file"
              name="parentsAadhaar"
              onChange={handleFileChange}
              required
            />
            {fileErrors.parentsAadhaar && (
              <p className="file-error">{fileErrors.parentsAadhaar}</p>
            )}

            <label>🏠 पत्ता पुरावा</label>
            <input
              type="file"
              name="addressProof"
              onChange={handleFileChange}
              required
            />
            {fileErrors.addressProof && (
              <p className="file-error">{fileErrors.addressProof}</p>
            )}
          </>
        )}

        {/* ================= मृत्यू प्रमाणपत्र ================= */}
        {formData.serviceType === "मृत्यू प्रमाणपत्र" && (
          <>
            <h4>👤 मृत व्यक्तीची माहिती</h4>
            <input
              name="deceasedName"
              placeholder="मृत व्यक्तीचे नाव"
              required
              onChange={handleChange}
            />
            <input
              type="date"
              name="dateOfDeath"
              required
              onChange={handleChange}
            />

            <h4>आवश्यक कागदपत्रे</h4>
            <label>मृत्यू प्रमाणपत्र / रुग्णालयाची पावती</label>
            <input
              type="file"
              name="deathSlip"
              onChange={handleFileChange}
              required
            />
            <label>मृत व्यक्तीचे आधार कार्ड</label>
            <input
              type="file"
              name="deceasedAadhaar"
              onChange={handleFileChange}
              required
            />
            <label>अर्जदाराचे आधार कार्ड</label>
            <input
              type="file"
              name="applicantAadhaar"
              onChange={handleFileChange}
              required
            />
          </>
        )}

        {/* ================= उत्पन्न प्रमाणपत्र ================= */}
        {formData.serviceType === "उत्पन्न प्रमाणपत्र" && (
          <>
            <h4> आवश्यक कागदपत्रे</h4>
            <label>🆔 अर्जदाराचे आधार कार्ड 👉 स्वतःचा आधार कार्ड </label>
            <input
              type="file"
              name="aadhaar"
              onChange={handleFileChange}
              required
            />
            <label>🍚 रेशन कार्ड 👉 कुटुंबाचे रेशन कार्ड</label>
            <input
              type="file"
              name="rationCard"
              onChange={handleFileChange}
              required
            />
            <label>
              उत्पन्नाचा पुरावा 👉 पगार स्लिप / शेती उत्पन्न दाखला / स्वघोषणा
              पत्र
            </label>
            <input
              type="file"
              name="incomeProof"
              onChange={handleFileChange}
              required
            />
          </>
        )}

        {/* ================= रहिवासी प्रमाणपत्र ================= */}
        {formData.serviceType === "रहिवासी प्रमाणपत्र" && (
          <>
            <h4>आवश्यक कागदपत्रे</h4>
            <label>🆔 अर्जदाराचे आधार कार्ड 👉 पत्ता असलेले आधार कार्ड </label>
            <input
              type="file"
              name="aadhaar"
              onChange={handleFileChange}
              required
            />
            <label>⚡ वीज बिल 👉 मागील 3 महिन्यांतील लाईट बिल</label>
            <input
              type="file"
              name="electricityBill"
              onChange={handleFileChange}
              required
            />
            <label>🍚 रेशन कार्ड 👉 सध्याच्या पत्त्याचे रेशन कार्ड</label>
            <input
              type="file"
              name="rationCard"
              onChange={handleFileChange}
              required
            />
          </>
        )}

        {/* ================= विवाह प्रमाणपत्र ================= */}
        {formData.serviceType === "विवाह प्रमाणपत्र" && (
          <>
            <h4> आवश्यक कागदपत्रे</h4>
            <label>🆔 वराचे आधार कार्ड 👉 नवऱ्याचे आधार कार्ड</label>
            <input
              type="file"
              name="brideGroomAadhaar"
              onChange={handleFileChange}
              required
            />
            <label>🆔 वधूचे आधार कार्ड 👉 नवरीचे आधार कार्ड</label>
            <input
              type="file"
              name="brideAadhaar"
              onChange={handleFileChange}
              required
            />
            <label>
              {" "}
               📅वयाचा पुरावा 👉 जन्म प्रमाणपत्र / शाळेचा दाखला / बोनाफाईड
            </label>
            <input
              type="file"
              name="ageProof"
              onChange={handleFileChange}
              required
            />
            <label>🏠 पत्ता पुरावा 👉 लाईट बिल / रेशन कार्ड</label>
            <input
              type="file"
              name="marriagePhoto"
              onChange={handleFileChange}
              required
            />
            <label>💍 विवाह समारंभाचे छायाचित्र 👉 लग्नाच्या वेळचा फोटो</label>
            <input
              type="file"
              name="witnessAadhaar"
              onChange={handleFileChange}
              required
            />
            <label>
              📜 लग्न पत्रिका / विवाह नोंद पुरावा 👉 लग्न पत्रिका किंवा मंदिर /
              रजिस्टर पुरावा
            </label>
            <input
              type="file"
              name="witnessAadhaar"
              onChange={handleFileChange}
              required
            />
            <label>
              👥 दोन साक्षीदारांचे आधार कार्ड 👉 दोन वेगवेगळ्या साक्षीदारांचे
              आधार
            </label>
            <input
              type="file"
              name="witnessAadhaar"
              onChange={handleFileChange}
              required
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "सादर होत आहे..." : "अर्ज सादर करा"}
        </button>
      </form>
    </div>
  );
};

export default ApplyService;
