import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientInfo from "../../components/Patient/HealthData/PatientInfo";

const API_URL = process.env.REACT_APP_API;

const ViewPatient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/healthRecordRoutes/viewById/${patientId}`);
        const data = await response.json();
        response.ok ? setPatientData(data) : setError("ไม่พบข้อมูลผู้ป่วย");
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    };
    fetchPatientData();
  }, [patientId]);

  const handleDelete = async (recordId) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) {
      try {
        const response = await fetch(`${API_URL}/api/healthRecordRoutes/delete/${recordId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("✅ ลบข้อมูลสำเร็จ!");
          navigate("/");
        } else {
          alert("❌ เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (err) {
        alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    }
  };

  return (
    <div className="container">
      <h2>ดูข้อมูลผู้ป่วย</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : patientData ? (
        <PatientInfo patient={patientData} handleDelete={handleDelete} />
      ) : (
        <p>⏳ กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default ViewPatient;
