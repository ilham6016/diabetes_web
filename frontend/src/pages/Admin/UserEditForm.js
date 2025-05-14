import React, { useState } from "react";

const UserEditForm = ({ user, handleSave, handleCancel }) => {
  const [formData, setFormData] = useState({ ...user });

  // จัดการการเปลี่ยนแปลงในฟิลด์ฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ส่งข้อมูลที่แก้ไขเมื่อผู้ใช้บันทึก
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData); // เรียกฟังก์ชัน handleSave จาก Parent Component
  };

  return (
    <form className="user-edit-form" onSubmit={handleSubmit}>
      <h2>แก้ไขข้อมูลผู้ใช้</h2>
      <label>
        ชื่อผู้ใช้:
        <input
          type="text"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        ชื่อจริง:
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        อีเมล:
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        สิทธิ์การใช้งาน:
        <select name="role" value={formData.role || ""} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </label>
      <button type="submit">✅ บันทึก</button>
      <button type="button" onClick={handleCancel}>
        ❌ ยกเลิก
      </button>
    </form>
  );
};

export default UserEditForm;
