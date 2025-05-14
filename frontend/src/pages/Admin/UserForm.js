import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ handleSave }) => {
  // สถานะสำหรับจัดเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "user", // ค่าเริ่มต้นเป็น 'user'
  });

  // จัดการการเปลี่ยนแปลงในฟิลด์ฟอร์ม
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // จัดการการส่งข้อมูลฟอร์มไปยัง API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
      if (!token) {
        alert("กรุณาเข้าสู่ระบบเพื่อดำเนินการ");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/admin/accounts/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // แนบ Token ใน Header
          },
        }
      );

      alert(response.data.message); // แจ้งผลเมื่อสำเร็จ

      if (handleSave) handleSave(); // เรียก handleSave หากส่งจาก Parent Component

      // รีเซ็ตฟอร์มหลังจากเพิ่มข้อมูล
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>เพิ่มผู้ใช้ใหม่</h2>
      <label>
        ชื่อผู้ใช้:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        ชื่อจริง:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        อีเมล:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        รหัสผ่าน:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        สิทธิ์การใช้งาน:
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </label>
      <button type="submit">💾 เพิ่มผู้ใช้</button>
    </form>
  );
};

export default UserForm;
