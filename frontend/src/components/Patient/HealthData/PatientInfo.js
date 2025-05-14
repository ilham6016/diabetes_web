import React from "react";

const PatientInfo = ({ patient, handleDelete }) => {
  return (
    <div className="patient-card">
      <h3>ข้อมูลผู้ป่วย</h3>
      <p><strong>รหัสผู้ป่วย:</strong> {patient.Patient_ID}</p>
      <p><strong>ระดับน้ำตาลในเลือด:</strong> {patient.Blood_Sugar}</p>
      <p><strong>ค่าความดันโลหิต:</strong> {patient.Systolic_BP}/{patient.Diastolic_BP}</p>
      <p><strong>น้ำหนัก:</strong> {patient.Weight} kg</p>
      <p><strong>สถานะเบาหวาน:</strong> {patient.Diabetes_Mellitus}</p>
      <p><strong>หมายเหตุ:</strong> {patient.Note}</p>
      <button onClick={() => handleDelete(patient.Health_Data_ID)}>🗑️ ลบข้อมูล</button>
    </div>
  );
};

export default PatientInfo;
