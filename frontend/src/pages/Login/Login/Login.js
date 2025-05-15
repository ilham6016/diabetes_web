import React, { useState } from "react";
import axios from "axios";
import GoogleLogin from "./GoogleLogin";
import { Link } from "react-router-dom";
import "./Login.css";

const API_URL = process.env.REACT_APP_API; // ✅ เพิ่มบรรทัดนี้

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData); // ✅ ใช้ API_URL
      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = parseJwt(token);
      localStorage.setItem("role", decoded?.role);

      window.location.href = "/home";
    } catch (error) {
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="ชื่อผู้ใช้ (Username)"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="รหัสผ่าน"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>

      <div className="google-login-container">
        <GoogleLogin setMessage={setMessage} />
      </div>

      {message && <p className="login-message">{message}</p>}

      <div className="register-link">
        <p>ยังไม่มีบัญชีใช่ไหม? <Link to="/register">สมัครสมาชิก</Link></p>
      </div>
    </div>
  );
}

export default Login;
