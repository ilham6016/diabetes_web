// src/routes/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // ดึง role จาก token (เช่น JWT)
  const getRoleFromToken = () => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // ดึง payload ของ token
      return decodedToken.role; // สมมติว่า role ถูกเก็บไว้ใน payload
    } catch (error) {
      return null;
    }
  };

  const role = getRoleFromToken(); // เช็ก role จาก token
  
  if (!token || role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
