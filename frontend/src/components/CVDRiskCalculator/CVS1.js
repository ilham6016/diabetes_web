import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // ใช้ในการดึง id จาก URL

function CVDRiskCalculator() {
  const { id } = useParams(); // ดึง id จาก URL
  const [patientData, setPatientData] = useState(null); // เก็บข้อมูลผู้ป่วย
  const [risk, setRisk] = useState(null); // เก็บผลการคำนวณความเสี่ยง
  const [advice, setAdvice] = useState(""); // คำแนะนำหลังการคำนวณ

  // ดึงข้อมูลผู้ป่วยจาก API เมื่อ id มีการเปลี่ยนแปลง
  useEffect(() => {
    if (id) {
      axios.get(`/api/getPatientData/${id}`) // ดึงข้อมูลผู้ป่วยตาม id
        .then(response => {
          setPatientData(response.data);
        })
        .catch(error => {
          console.error("Error fetching patient data: ", error);
        });
    }
  }, [id]); // การเปลี่ยนแปลง id จะ trigger ให้ดึงข้อมูลใหม่

  // คำนวณความเสี่ยงเมื่อมีข้อมูลผู้ป่วย
  const calculateCVDScore = () => {
    if (!patientData) return; // ตรวจสอบว่ามีข้อมูลผู้ป่วยก่อนที่จะคำนวณ

    const { age, sex, smoke, dm, sbp, waist, height } = patientData;

    // คำนวณ Full Score
    const fullScore = (0.079 * age) + (0.128 * sex) + (0.019350987 * sbp) + (0.58454 * dm) + (3.512566 * (waist / height)) + (0.459 * smoke);

    // คำนวณ P Full Score (%)
    const riskPercentage = (1 - Math.pow(0.978296, Math.exp(fullScore - 7.720484))) * 100;

    // กำหนดระดับความเสี่ยงและคำแนะนำตามค่า riskPercentage
    let riskLevel = '';
    let adviceMessage = '';

    if (riskPercentage < 10) {
      riskLevel = 'สีเขียว (เสี่ยงน้อย)';
      adviceMessage = 'คุณมีความเสี่ยงน้อยต่อการเกิดโรคหัวใจและสมองในอีก 10 ปี ควรออกกำลังกาย, รับประทานผักผลไม้, เลิกสูบบุหรี่, ควบคุมน้ำหนัก และตรวจสุขภาพประจำปี';
    } else if (riskPercentage >= 10 && riskPercentage < 30) {
      riskLevel = 'สีเหลือง (เสี่ยงปานกลาง)';
      adviceMessage = 'คุณมีความเสี่ยงปานกลาง ควรออกกำลังกาย, เลิกสูบบุหรี่, รักษาระดับน้ำตาลในเลือด, และควบคุมน้ำหนัก';
    } else {
      riskLevel = 'สีแดง (เสี่ยงสูง)';
      adviceMessage = 'คุณมีความเสี่ยงสูง ควรปรึกษาแพทย์และควบคุมปัจจัยเสี่ยง เช่น ความดันโลหิต, น้ำตาลในเลือด, และน้ำหนัก';
    }

    setRisk(riskPercentage);
    setAdvice(adviceMessage);
  };

  return (
    <div>
      <h2>คำนวณความเสี่ยงโรคหัวใจและสมองในอีก 10 ปี</h2>

      {/* แสดงข้อมูลผู้ป่วย */}
      {patientData && (
        <div>
          <p>ชื่อผู้ป่วย: {patientData.name}</p>
          <p>อายุ: {patientData.age}</p>
          <p>เพศ: {patientData.sex === 1 ? 'ชาย' : 'หญิง'}</p>
          <p>การสูบบุหรี่: {patientData.smoke === 1 ? 'สูบ' : 'ไม่สูบ'}</p>
          <p>เบาหวาน: {patientData.dm === 1 ? 'ป่วย' : 'ไม่ป่วย'}</p>
          <p>ความดันโลหิต: {patientData.sbp} mmHg</p>
          <p>รอบเอว: {patientData.waist} cm</p>
          <p>ส่วนสูง: {patientData.height} cm</p>
        </div>
      )}

      {/* ปุ่มคำนวณ */}
      <button onClick={calculateCVDScore}>คำนวณ</button>

      {/* แสดงผลการคำนวณ */}
      {risk !== null && (
        <div>
          <h3>ระดับความเสี่ยง: {risk.toFixed(2)}%</h3>
          <p>{advice}</p>
        </div>
      )}
    </div>
  );
}

export default CVDRiskCalculator;
