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
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  /* PREFILL SERVICE */
  useEffect(() => {
    window.scrollTo(0,0)
    const params = new URLSearchParams(location.search);
    const serviceFromUrl = params.get("service");
    if (serviceFromUrl) {
      setFormData((p) => ({ ...p, serviceType: serviceFromUrl }));
    }
  }, [location.search]);

  /* VALIDATION RULES */
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "serviceType":
        if (!value) error = "कृपया सेवा निवडा";
        break;

      case "fullName":
        if (!value.trim()) {
          error = "पूर्ण नाव आवश्यक आहे";
        } else if (value.trim().length < 3) {
          error = "नाव किमान 3 अक्षरांचे असावे";
        } else if (!/^[a-zA-Zà-ÿĀ-ſА-яа-я\u0900-\u097F\s]+$/.test(value)) {
          error = "नावात फक्त अक्षरे असावीत";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "पत्ता आवश्यक आहे";
        } else if (value.trim().length < 10) {
          error = "पत्ता किमान 10 अक्षरांचा असावा";
        }
        break;

      case "mobile":
        if (!value) {
          error = "मोबाईल क्रमांक आवश्यक आहे";
        } else if (!/^\d{10}$/.test(value)) {
          error = "कृपया 10 अंकी मोबाईल क्रमांक टाका";
        } else if (!/^[5-9]\d{9}$/.test(value)) {
          error = "भारतीय मोबाईल क्रमांक 7,8,9 ने सुरू होतो";
        }
        break;

      case "deceasedName":
        if (formData.serviceType === "मृत्यू प्रमाणपत्र") {
          if (!value.trim()) {
            error = "मृत व्यक्तीचे नाव आवश्यक आहे";
          } else if (value.trim().length < 3) {
            error = "नाव किमान 3 अक्षरांचे असावे";
          }
        }
        break;

      case "dateOfDeath":
        if (formData.serviceType === "मृत्यू प्रमाणपत्र") {
          if (!value) {
            error = "मृत्यूची तारीख आवश्यक आहे";
          } else {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate > today) {
              error = "भविष्यातील तारीख निवडू शकत नाही";
            } else {
              const hundredYearsAgo = new Date();
              hundredYearsAgo.setFullYear(today.getFullYear() - 100);
              if (selectedDate < hundredYearsAgo) {
                error = "तारीख 100 वर्षांपेक्षा जुनी असू शकत नाही";
              }
            }
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  /* INPUT CHANGE WITH VALIDATION */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  /* HANDLE BLUR - Mark field as touched */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  /* FILE VALIDATION */
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    
    if (!file) {
      setFileErrors((p) => ({ ...p, [name]: "" }));
      setFiles((p) => {
        const newFiles = { ...p };
        delete newFiles[name];
        return newFiles;
      });
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileErrors((p) => ({
        ...p,
        [name]: "❌ फक्त JPG, JPEG,  किंवा PNG फाईल अपलोड करा",
      }));
      e.target.value = "";
      setFiles((p) => {
        const newFiles = { ...p };
        delete newFiles[name];
        return newFiles;
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((p) => ({
        ...p,
        [name]: "❌ फाईलचा आकार 500 KB पेक्षा जास्त नसावा",
      }));
      e.target.value = "";
      setFiles((p) => {
        const newFiles = { ...p };
        delete newFiles[name];
        return newFiles;
      });
      return;
    }

    setFileErrors((p) => ({ ...p, [name]: "" }));
    setFiles((p) => ({ ...p, [name]: file }));
  };

  /* VALIDATE ALL FIELDS BEFORE SUBMIT */
  const validateAllFields = () => {
    const errors = {};
    
    // Validate required text fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    // Validate required files based on service type
    const requiredFiles = getRequiredFiles();
    requiredFiles.forEach((fileName) => {
      if (!files[fileName]) {
        errors[fileName] = "❌ कृपया आवश्यक फाईल अपलोड करा";
      }
    });

    return errors;
  };

  /* GET REQUIRED FILES BASED ON SERVICE TYPE */
  const getRequiredFiles = () => {
    switch (formData.serviceType) {
      case "जन्म प्रमाणपत्र":
        return ["hospitalSlip", "parentsAadhaar", "addressProof"];
      case "मृत्यू प्रमाणपत्र":
        return ["deathSlip", "deceasedAadhaar", "applicantAadhaar"];
      case "उत्पन्न प्रमाणपत्र":
        return ["aadhaar", "rationCard", "incomeProof"];
      case "रहिवासी प्रमाणपत्र":
        return ["aadhaar", "electricityBill", "rationCard"];
      case "विवाह प्रमाणपत्र":
        return ["brideGroomAadhaar", "brideAadhaar", "ageProof", "marriagePhoto", "witnessAadhaar"];
      default:
        return [];
    }
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = [...Object.keys(formData), ...getRequiredFiles()];
    const touchedState = {};
    allFields.forEach((field) => {
      touchedState[field] = true;
    });
    setTouched(touchedState);

    // Validate all fields
    const errors = validateAllFields();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFileErrors(errors);
      alert("⚠️ कृपया सर्व आवश्यक माहिती भरा आणि चुका दुरुस्त करा");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    Object.entries(files).forEach(([k, f]) => data.append(k, f));

    try {
      await axios.post(`${API}/api/services/apply`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ अर्ज यशस्वीरीत्या सादर झाला!");
      
      // Reset form
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
      setFieldErrors({});
      setTouched({});
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = "";
      });
    } catch (error) {
      alert("❌ अर्ज सादर होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="apply-service-container">
      <h2>सेवेसाठी अर्ज करा</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        {/* SERVICE */}
        <label>सेवा निवडा</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldErrors.serviceType ? "error" : ""}
          required
        >
          <option value="">-- सेवा निवडा --</option>
          <option value="जन्म प्रमाणपत्र">जन्म प्रमाणपत्र</option>
          <option value="मृत्यू प्रमाणपत्र">मृत्यू प्रमाणपत्र</option>
          <option value="उत्पन्न प्रमाणपत्र">उत्पन्न प्रमाणपत्र</option>
          <option value="रहिवासी प्रमाणपत्र">रहिवासी प्रमाणपत्र</option>
          <option value="विवाह प्रमाणपत्र">विवाह प्रमाणपत्र</option>
        </select>
        {fieldErrors.serviceType && (
          <p className="field-error">{fieldErrors.serviceType}</p>
        )}

        {/* APPLICANT */}
        <h4>अर्जदाराची माहिती</h4>
        
        <label>पूर्ण नाव</label>
        <input
          name="fullName"
          placeholder="उदा. राजेश कुमार शर्मा"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldErrors.fullName ? "error" : ""}
          required
        />
        {fieldErrors.fullName && (
          <p className="field-error">{fieldErrors.fullName}</p>
        )}

        <label>पत्ता</label>
        <input
          name="address"
          placeholder="उदा. घर क्रमांक, गाव/शहर, तालुका, जिल्हा"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldErrors.address ? "error" : ""}
          required
        />
        {fieldErrors.address && (
          <p className="field-error">{fieldErrors.address}</p>
        )}

        <label>मोबाईल क्रमांक</label>
        <input
          name="mobile"
          placeholder="उदा. 9876543210"
          value={formData.mobile}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={10}
          className={fieldErrors.mobile ? "error" : ""}
          required
        />
        {fieldErrors.mobile && (
          <p className="field-error">{fieldErrors.mobile}</p>
        )}

        {/* ================= जन्म प्रमाणपत्र ================= */}
        {formData.serviceType === "जन्म प्रमाणपत्र" && (
          <>
            <h4>आवश्यक कागदपत्रे</h4>

            <label>🏥 रुग्णालयाची पावती</label>
            <input
              type="file"
              name="hospitalSlip"
              onChange={handleFileChange}
              className={fileErrors.hospitalSlip ? "error" : files.hospitalSlip ? "success" : ""}
              required
            />
            {fileErrors.hospitalSlip && (
              <p className="file-error">{fileErrors.hospitalSlip}</p>
            )}
            {files.hospitalSlip && !fileErrors.hospitalSlip && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>🆔 पालकांचे आधार कार्ड</label>
            <input
              type="file"
              name="parentsAadhaar"
              onChange={handleFileChange}
              className={fileErrors.parentsAadhaar ? "error" : files.parentsAadhaar ? "success" : ""}
              required
            />
            {fileErrors.parentsAadhaar && (
              <p className="file-error">{fileErrors.parentsAadhaar}</p>
            )}
            {files.parentsAadhaar && !fileErrors.parentsAadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>🏠 पत्ता पुरावा</label>
            <input
              type="file"
              name="addressProof"
              onChange={handleFileChange}
              className={fileErrors.addressProof ? "error" : files.addressProof ? "success" : ""}
              required
            />
            {fileErrors.addressProof && (
              <p className="file-error">{fileErrors.addressProof}</p>
            )}
            {files.addressProof && !fileErrors.addressProof && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}
          </>
        )}

        {/* ================= मृत्यू प्रमाणपत्र ================= */}
        {formData.serviceType === "मृत्यू प्रमाणपत्र" && (
          <>
            <h4>👤 मृत व्यक्तीची माहिती</h4>
            
            <label>मृत व्यक्तीचे नाव</label>
            <input
              name="deceasedName"
              placeholder="उदा. सुरेश पाटील"
              value={formData.deceasedName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.deceasedName ? "error" : ""}
              required
            />
            {fieldErrors.deceasedName && (
              <p className="field-error">{fieldErrors.deceasedName}</p>
            )}

            <label>मृत्यूची तारीख</label>
            <input
              type="date"
              name="dateOfDeath"
              value={formData.dateOfDeath}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.dateOfDeath ? "error" : ""}
              required
            />
            {fieldErrors.dateOfDeath && (
              <p className="field-error">{fieldErrors.dateOfDeath}</p>
            )}

            <h4>आवश्यक कागदपत्रे</h4>
            
            <label>मृत्यू प्रमाणपत्र / रुग्णालयाची पावती</label>
            <input
              type="file"
              name="deathSlip"
              onChange={handleFileChange}
              className={fileErrors.deathSlip ? "error" : files.deathSlip ? "success" : ""}
              required
            />
            {fileErrors.deathSlip && (
              <p className="file-error">{fileErrors.deathSlip}</p>
            )}
            {files.deathSlip && !fileErrors.deathSlip && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>मृत व्यक्तीचे आधार कार्ड</label>
            <input
              type="file"
              name="deceasedAadhaar"
              onChange={handleFileChange}
              className={fileErrors.deceasedAadhaar ? "error" : files.deceasedAadhaar ? "success" : ""}
              required
            />
            {fileErrors.deceasedAadhaar && (
              <p className="file-error">{fileErrors.deceasedAadhaar}</p>
            )}
            {files.deceasedAadhaar && !fileErrors.deceasedAadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>अर्जदाराचे आधार कार्ड</label>
            <input
              type="file"
              name="applicantAadhaar"
              onChange={handleFileChange}
              className={fileErrors.applicantAadhaar ? "error" : files.applicantAadhaar ? "success" : ""}
              required
            />
            {fileErrors.applicantAadhaar && (
              <p className="file-error">{fileErrors.applicantAadhaar}</p>
            )}
            {files.applicantAadhaar && !fileErrors.applicantAadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}
          </>
        )}

        {/* ================= उत्पन्न प्रमाणपत्र ================= */}
        {formData.serviceType === "उत्पन्न प्रमाणपत्र" && (
          <>
            <h4>आवश्यक कागदपत्रे</h4>
            
            <label>🆔 अर्जदाराचे आधार कार्ड 👉 स्वतःचा आधार कार्ड</label>
            <input
              type="file"
              name="aadhaar"
              onChange={handleFileChange}
              className={fileErrors.aadhaar ? "error" : files.aadhaar ? "success" : ""}
              required
            />
            {fileErrors.aadhaar && (
              <p className="file-error">{fileErrors.aadhaar}</p>
            )}
            {files.aadhaar && !fileErrors.aadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>🍚 रेशन कार्ड 👉 कुटुंबाचे रेशन कार्ड</label>
            <input
              type="file"
              name="rationCard"
              onChange={handleFileChange}
              className={fileErrors.rationCard ? "error" : files.rationCard ? "success" : ""}
              required
            />
            {fileErrors.rationCard && (
              <p className="file-error">{fileErrors.rationCard}</p>
            )}
            {files.rationCard && !fileErrors.rationCard && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>💰 उत्पन्नाचा पुरावा 👉 पगार स्लिप / शेती उत्पन्न दाखला</label>
            <input
              type="file"
              name="incomeProof"
              onChange={handleFileChange}
              className={fileErrors.incomeProof ? "error" : files.incomeProof ? "success" : ""}
              required
            />
            {fileErrors.incomeProof && (
              <p className="file-error">{fileErrors.incomeProof}</p>
            )}
            {files.incomeProof && !fileErrors.incomeProof && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}
          </>
        )}

        {/* ================= रहिवासी प्रमाणपत्र ================= */}
        {formData.serviceType === "रहिवासी प्रमाणपत्र" && (
          <>
            <h4>आवश्यक कागदपत्रे</h4>
            
            <label>🆔 अर्जदाराचे आधार कार्ड 👉 पत्ता असलेले आधार कार्ड</label>
            <input
              type="file"
              name="aadhaar"
              onChange={handleFileChange}
              className={fileErrors.aadhaar ? "error" : files.aadhaar ? "success" : ""}
              required
            />
            {fileErrors.aadhaar && (
              <p className="file-error">{fileErrors.aadhaar}</p>
            )}
            {files.aadhaar && !fileErrors.aadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>⚡ वीज बिल 👉 मागील 3 महिन्यांतील लाईट बिल</label>
            <input
              type="file"
              name="electricityBill"
              onChange={handleFileChange}
              className={fileErrors.electricityBill ? "error" : files.electricityBill ? "success" : ""}
              required
            />
            {fileErrors.electricityBill && (
              <p className="file-error">{fileErrors.electricityBill}</p>
            )}
            {files.electricityBill && !fileErrors.electricityBill && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>🍚 रेशन कार्ड 👉 सध्याच्या पत्त्याचे रेशन कार्ड</label>
            <input
              type="file"
              name="rationCard"
              onChange={handleFileChange}
              className={fileErrors.rationCard ? "error" : files.rationCard ? "success" : ""}
              required
            />
            {fileErrors.rationCard && (
              <p className="file-error">{fileErrors.rationCard}</p>
            )}
            {files.rationCard && !fileErrors.rationCard && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}
          </>
        )}

        {/* ================= विवाह प्रमाणपत्र ================= */}
        {formData.serviceType === "विवाह प्रमाणपत्र" && (
          <>
            <h4>आवश्यक कागदपत्रे</h4>
            
            <label>🆔 वराचे आधार कार्ड 👉 नवऱ्याचे आधार कार्ड</label>
            <input
              type="file"
              name="brideGroomAadhaar"
              onChange={handleFileChange}
              className={fileErrors.brideGroomAadhaar ? "error" : files.brideGroomAadhaar ? "success" : ""}
              required
            />
            {fileErrors.brideGroomAadhaar && (
              <p className="file-error">{fileErrors.brideGroomAadhaar}</p>
            )}
            {files.brideGroomAadhaar && !fileErrors.brideGroomAadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>🆔 वधूचे आधार कार्ड 👉 नवरीचे आधार कार्ड</label>
            <input
              type="file"
              name="brideAadhaar"
              onChange={handleFileChange}
              className={fileErrors.brideAadhaar ? "error" : files.brideAadhaar ? "success" : ""}
              required
            />
            {fileErrors.brideAadhaar && (
              <p className="file-error">{fileErrors.brideAadhaar}</p>
            )}
            {files.brideAadhaar && !fileErrors.brideAadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>📅 वयाचा पुरावा 👉 जन्म प्रमाणपत्र / शाळेचा दाखला</label>
            <input
              type="file"
              name="ageProof"
              onChange={handleFileChange}
              className={fileErrors.ageProof ? "error" : files.ageProof ? "success" : ""}
              required
            />
            {fileErrors.ageProof && (
              <p className="file-error">{fileErrors.ageProof}</p>
            )}
            {files.ageProof && !fileErrors.ageProof && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>💍 विवाह समारंभाचे छायाचित्र 👉 लग्नाच्या वेळचा फोटो</label>
            <input
              type="file"
              name="marriagePhoto"
              onChange={handleFileChange}
              className={fileErrors.marriagePhoto ? "error" : files.marriagePhoto ? "success" : ""}
              required
            />
            {fileErrors.marriagePhoto && (
              <p className="file-error">{fileErrors.marriagePhoto}</p>
            )}
            {files.marriagePhoto && !fileErrors.marriagePhoto && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}

            <label>👥 साक्षीदारांचे आधार कार्ड 👉 दोन साक्षीदारांचे आधार</label>
            <input
              type="file"
              name="witnessAadhaar"
              onChange={handleFileChange}
              className={fileErrors.witnessAadhaar ? "error" : files.witnessAadhaar ? "success" : ""}
              required
            />
            {fileErrors.witnessAadhaar && (
              <p className="file-error">{fileErrors.witnessAadhaar}</p>
            )}
            {files.witnessAadhaar && !fileErrors.witnessAadhaar && (
              <p className="file-success">✅ फाईल यशस्वीरीत्या अपलोड झाली</p>
            )}
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