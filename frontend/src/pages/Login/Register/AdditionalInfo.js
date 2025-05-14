import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdditionalInfo.css";

function AdditionalInfo() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [googleData, setGoogleData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const googleRegisterData = JSON.parse(localStorage.getItem("googleRegister"));
    if (googleRegisterData) {
      setGoogleData(googleRegisterData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const completeData = { ...googleData, ...formData };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/google/register", completeData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div className="additional-info-container">
      <h2>กรอกข้อมูลเพิ่มเติม</h2>

      <form onSubmit={handleSubmit}>
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
        <button type="submit">สมัครสมาชิก</button>
      </form>

      {message && <p className="message">{message}</p>}

      <div className="back-link">
        <p><Link to="/register">ย้อนกลับ</Link></p>
      </div>
    </div>
  );
}

export default AdditionalInfo;
