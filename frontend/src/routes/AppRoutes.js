import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // นำเข้า ProtectedRoute
import AdminRoute from "./AdminRoute"; // นำเข้า AdminRoute

// หน้าอื่นๆ
import WelcomePage from "../pages/Welcome/WelcomePage";
import Register from "../pages/Login/Register/Register";
import Register1 from "../pages/Login/Register/AdditionalInfo";
import Login from "../pages/Login/Login/Login";
import Appointment from "../pages/Appointment/AppointmentPage";
import ManageAccounts from "../pages/Admin/ManageAccounts"; // หน้า Admin สำหรับจัดการผู้ใช้
import UserProfile from "../pages/UserProfile/UserProfile";
import EditProfile from "../pages/UserProfile/EditProfile";
import Report from "../pages/Report/ReportPage";
import Export from "../pages/Export/Exportpage";
import HomePage from "../pages/Home/homepage";
import Patients from "../pages/Patients/Patient/Patient";
import CVDRiskCalculator from "../components/CVDRiskCalculator/CVDRiskCalculator";

const AppRoutes = () => (
  <Routes>
    {/* หน้า Welcome */}
    <Route path="/" element={<WelcomePage />} />

    {/* เส้นทางที่ไม่ต้องล็อกอิน */}
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/additional-info" element={<Register1 />} />
    <Route path="/cvs" element={<CVDRiskCalculator />} />
    
    {/* เส้นทางที่ต้องล็อกอิน */} 
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/appointments"
      element={
        <ProtectedRoute>
          <Appointment />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <Report />
        </ProtectedRoute>
      }
    />
        <Route
      path="/export"
      element={
        <ProtectedRoute>
          <Export />
        </ProtectedRoute>
      }
    />
        <Route
      path="/patients"
      element={
        <ProtectedRoute>
          <Patients/>
        </ProtectedRoute>
      }
    />

    {/* เส้นทางที่เฉพาะ Admin เท่านั้น */}
    <Route
      path="/manage-users"
      element={
        <AdminRoute>
          <ManageAccounts />
        </AdminRoute>
      }
    />

    {/* เส้นทางสำหรับผู้ใช้ทั่วไป */}
    <Route
      path="/user/profile"
      element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/user/edit-profile"
      element={
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
