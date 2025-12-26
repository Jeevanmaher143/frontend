import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

// ✅ SAFE API URL (production + local)
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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("पासवर्ड जुळत नाहीत!");
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
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMobile("");
        setVillage("");
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMobile("");
    setVillage("");
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

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>पूर्ण नाव</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="input-group">
            <label>ई-मेल</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label>मोबाईल क्रमांक</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label>गावाचे नाव</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label>पासवर्ड</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>पासवर्डची पुष्टी करा</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
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