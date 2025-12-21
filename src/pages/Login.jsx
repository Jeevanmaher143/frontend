import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
      alert("Passwords do not match!");
      return;
    }

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );

        login(res.data.token, res.data.user);

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        // 📝 REGISTER (ALL REQUIRED FIELDS)
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            fullName,
            email,
            password,
            mobile,
            village
          }
        );

        alert("Registration successful! Please login.");

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
        `${isLogin ? "Login" : "Registration"} failed`
      );
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
          <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p>{isLogin ? "Please login to continue" : "Sign up to get started"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* MOBILE */}
          {!isLogin && (
            <div className="input-group">
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          )}

          {/* VILLAGE */}
          {!isLogin && (
            <div className="input-group">
              <label>Village</label>
              <input
                type="text"
                placeholder="Enter village name"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={toggleMode} className="toggle-link">
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
