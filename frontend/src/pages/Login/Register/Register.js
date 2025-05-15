import React, { useState } from "react";
import axios from "axios";
import GoogleRegister from "./GoogleRegister";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API;

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, formData); // ✅ ใช้ API_URL
      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div className="register-container">
      <h2>สมัครสมาชิก</h2>

      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="ชื่อผู้ใช้ (Username)"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="ชื่อ-นามสกุล"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="อีเมล"
          value={formData.email}
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
        <button type="submit">ลงทะเบียน</button>
      </form>

      <div className="divider">หรือ</div>

      <GoogleRegister />

      {message && <p className="message">{message}</p>}

      <div className="back-to-login">
        <p>มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}

export default Register;
