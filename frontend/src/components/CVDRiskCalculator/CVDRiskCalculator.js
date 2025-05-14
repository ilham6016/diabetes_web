import React, { useState } from 'react';

function CVDRiskCalculator() {
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState(0); // 1 = male, 0 = female
  const [smoke, setSmoke] = useState(0); // 1 = smoker, 0 = non-smoker
  const [dm, setDm] = useState(0); // 1 = diabetic, 0 = non-diabetic
  const [sbp, setSbp] = useState(0); // Systolic Blood Pressure
  const [waist, setWaist] = useState(0); // Waist circumference in cm
  const [height, setHeight] = useState(0); // Height in cm
  const [risk, setRisk] = useState(null); // To store the calculated risk
  const [advice, setAdvice] = useState(""); // To store advice based on the risk level

  const calculateCVDScore = () => {
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

      <div>
        <label>อายุ: </label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>

      <div>
        <label>เพศ: </label>
        <select value={sex} onChange={(e) => setSex(Number(e.target.value))}>
          <option value={0}>หญิง</option>
          <option value={1}>ชาย</option>
        </select>
      </div>

      <div>
        <label>การสูบบุหรี่: </label>
        <select value={smoke} onChange={(e) => setSmoke(Number(e.target.value))}>
          <option value={0}>ไม่สูบ</option>
          <option value={1}>สูบ</option>
        </select>
      </div>

      <div>
        <label>เบาหวาน: </label>
        <select value={dm} onChange={(e) => setDm(Number(e.target.value))}>
          <option value={0}>ไม่ป่วยเป็นเบาหวาน</option>
          <option value={1}>ป่วยเป็นเบาหวาน</option>
        </select>
      </div>

      <div>
        <label>ความดันโลหิตซิสโตลิก (SBP): </label>
        <input type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} />
      </div>

      <div>
        <label>รอบเอว (cm): </label>
        <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} />
      </div>

      <div>
        <label>ส่วนสูง (cm): </label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>

      <button onClick={calculateCVDScore}>คำนวณ</button>

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
