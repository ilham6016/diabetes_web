// src/components/auth/GoogleRegisterForm.js
import React, { useState } from 'react';

const GoogleRegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    // phone: '', // Removed from form
    // birthdate: '', // Removed from form
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
      {/* <input type="text" name="phone" placeholder="Phone" onChange={handleInputChange} /> */}
      {/* <input type="date" name="birthdate" placeholder="Birthdate" onChange={handleInputChange} /> */}
      <button type="submit">ดำเนินการต่อ</button>
    </form>
  );
};

export default GoogleRegisterForm;