import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const API = "https://backend-9i6n.onrender.com";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // COMMON
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER ONLY
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // VALIDATION ERRORS
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // VALIDATION FUNCTIONS
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "ई-मेल आवश्यक आहे";
    if (!emailRegex.test(email)) return "वैध ई-मेल प्रविष्ट करा";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "पासवर्ड आवश्यक आहे";
    if (password.length < 6) return "पासवर्ड किमान ६ अक्षरांचा असावा";
    return "";
  };

  const validateFullName = (name) => {
    if (!name) return "पूर्ण नाव आवश्यक आहे";
    if (name.length < 3) return "नाव किमान ३ अक्षरांचे असावे";
    return "";
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile) return "मोबाईल क्रमांक आवश्यक आहे";
    if (!mobileRegex.test(mobile)) return "वैध १० अंकी मोबाईल क्रमांक प्रविष्ट करा";
    return "";
  };

  const validateVillage = (village) => {
    if (!village) return "गावाचे नाव आवश्यक आहे";
    if (village.length < 2) return "गावाचे नाव किमान २ अक्षरांचे असावे";
    return "";
  };

  const validateConfirmPassword = (confirmPass, pass) => {
    if (!confirmPass) return "पासवर्डची पुष्टी आवश्यक आहे";
    if (confirmPass !== pass) return "पासवर्ड जुळत नाहीत";
    return "";
  };

  // HANDLE FIELD BLUR
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // VALIDATE INDIVIDUAL FIELD
  const validateField = (field) => {
    let error = "";
    
    switch (field) {
      case "email":
        error = validateEmail(email);
        break;
      case "password":
        error = validatePassword(password);
        break;
      case "fullName":
        error = validateFullName(fullName);
        break;
      case "mobile":
        error = validateMobile(mobile);
        break;
      case "village":
        error = validateVillage(village);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(confirmPassword, password);
        break;
      default:
        break;
    }

    setErrors({ ...errors, [field]: error });
    return error === "";
  };

  // VALIDATE ALL FIELDS
  const validateAllFields = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);

    if (!isLogin) {
      newErrors.fullName = validateFullName(fullName);
      newErrors.mobile = validateMobile(mobile);
      newErrors.village = validateVillage(village);
      newErrors.confirmPassword = validateConfirmPassword(confirmPassword, password);
    }

    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(newErrors).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const res = await axios.post(`${API}/api/auth/login`, {
          email,
          password,
        });

        login(res.data.token, res.data.user);

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        // 📝 REGISTER
        await axios.post(`${API}/api/auth/register`, {
          fullName,
          email,
          password,
          mobile,
          village,
        });

        alert("नोंदणी यशस्वी झाली! कृपया लॉगिन करा.");

        setIsLogin(true);
        resetForm();
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          `${isLogin ? "लॉगिन" : "नोंदणी"} अयशस्वी झाली`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMobile("");
    setVillage("");
    setErrors({});
    setTouched({});
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>{isLogin ? "पुन्हा स्वागत आहे" : "नवीन खाते तयार करा"}</h1>
          <p>
            {isLogin
              ? "कृपया पुढे जाण्यासाठी लॉगिन करा"
              : "सुरू करण्यासाठी नोंदणी करा"}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="input-group">
              <label>पूर्ण नाव</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (touched.fullName) validateField("fullName");
                }}
                onBlur={() => handleBlur("fullName")}
                className={touched.fullName && errors.fullName ? "input-error" : ""}
                disabled={isLoading}
              />
              {touched.fullName && errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>
          )}

          <div className="input-group">
            <label>ई-मेल</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) validateField("email");
              }}
              onBlur={() => handleBlur("email")}
              className={touched.email && errors.email ? "input-error" : ""}
              disabled={isLoading}
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label>मोबाईल क्रमांक</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(value);
                    if (touched.mobile) validateField("mobile");
                  }}
                  onBlur={() => handleBlur("mobile")}
                  className={touched.mobile && errors.mobile ? "input-error" : ""}
                  disabled={isLoading}
                  maxLength="10"
                />
                {touched.mobile && errors.mobile && (
                  <span className="error-message">{errors.mobile}</span>
                )}
              </div>

              <div className="input-group">
                <label>गावाचे नाव</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    if (touched.village) validateField("village");
                  }}
                  onBlur={() => handleBlur("village")}
                  className={touched.village && errors.village ? "input-error" : ""}
                  disabled={isLoading}
                />
                {touched.village && errors.village && (
                  <span className="error-message">{errors.village}</span>
                )}
              </div>
            </>
          )}

          <div className="input-group">
            <label>पासवर्ड</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) validateField("password");
                if (touched.confirmPassword && !isLogin) validateField("confirmPassword");
              }}
              onBlur={() => handleBlur("password")}
              className={touched.password && errors.password ? "input-error" : ""}
              disabled={isLoading}
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>पासवर्डची पुष्टी करा</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) validateField("confirmPassword");
                }}
                onBlur={() => handleBlur("confirmPassword")}
                className={touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}
                disabled={isLoading}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loader"></span>
                <span className="loader-text">
                  {isLogin ? "लॉगिन होत आहे..." : "नोंदणी होत आहे..."}
                </span>
              </>
            ) : (
              <span>{isLogin ? "लॉगिन करा" : "नोंदणी करा"}</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "खाते नाही आहे?" : "आधीच खाते आहे?"}
            <span className="toggle-link" onClick={toggleMode}>
              {isLogin ? " नोंदणी करा" : " लॉगिन करा"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;