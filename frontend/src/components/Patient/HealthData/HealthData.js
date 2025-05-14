import React from "react";

const HealthData = ({ record }) => {
  return (
    <div className="record-card">
      <h3>ข้อมูลสุขภาพ</h3>
      <p><strong>รหัสผู้ป่วย:</strong> {record.patientId}</p>
      <p><strong>วันที่บันทึก:</strong> {record.date}</p>
      <p><strong>ระดับน้ำตาล:</strong> {record.bloodSugar}</p>
      <p><strong>ความดันโลหิต:</strong> {record.systolicBP}/{record.diastolicBP}</p>
      <p><strong>น้ำหนัก:</strong> {record.weight} kg</p>
      <p><strong>ส่วนสูง:</strong> {record.height} cm</p>
      <p><strong>BMI:</strong> {record.bmi}</p>
      <p><strong>สถานะเบาหวาน:</strong> {record.diabetesMellitus}</p>
      <p><strong>หมายเหตุ:</strong> {record.note}</p>
    </div>
  );
};

export default HealthData;
