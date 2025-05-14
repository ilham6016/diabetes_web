// controllers/riskController.js
const db = require('../config/db');

// ฟังก์ชันคำนวณ ASCVD score
exports.calculateASCVDScore = (req, res) => {
  const { patientId } = req.params;

  // ดึงข้อมูลผู้ป่วยจากฐานข้อมูล
  const query = `
    SELECT 
      hd.Systolic_BP, hd.Waist, hd.Height, hd.Weight,
      p.Age, p.Gender, hd.Smoke, hd.Diabetes_Mellitus
    FROM Health_Data hd
    JOIN Patient p ON hd.Patient_ID = p.Patient_ID
    WHERE hd.Patient_ID = ?
    ORDER BY hd.Date_Recorded DESC
    LIMIT 1
  `;

  db.query(query, [patientId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: 'Error fetching patient data', error: err });
    }

    const patient = results[0];

    // ข้อมูลที่ใช้ในการคำนวณ
    const { Age, Gender, Systolic_BP, Waist, Height, Smoke, Diabetes_Mellitus, Weight } = patient;

    // เช็คค่าพารามิเตอร์ก่อนการคำนวณ
    if (Age == null || Gender == null || Systolic_BP == null || Waist == null || Height == null || Weight == null) {
      return res.status(400).json({ message: 'Missing required data for calculation' });
    }

    // คำนวณค่า BMI (Body Mass Index)
    const BMI = Weight / Math.pow(Height / 100, 2);
    const Waist_to_Height_Ratio = Waist / Height;

    // คำนวณ ASCVD Full Score
    const Full_Score = (0.079 * Age) + (0.128 * (Gender === 'Male' ? 1 : 0)) + (0.019350987 * Systolic_BP)
                      + (0.5854 * Diabetes_Mellitus) + (3.512566 * Waist_to_Height_Ratio)
                      + (0.459 * Smoke);

    // คำนวณ ASCVD Score Percentage
    const Risk_Percentage = (1 - (0.978296 * Math.exp(Full_Score - 7.720484))) * 100;

    // กำหนดระดับความเสี่ยง
    let Risk_Level = '';
    if (Risk_Percentage < 5) Risk_Level = 'Low';
    else if (Risk_Percentage < 20) Risk_Level = 'Moderate';
    else Risk_Level = 'High';

    // ตรวจสอบค่าที่ได้ไม่เป็น NaN ก่อนบันทึก
    if (isNaN(Full_Score) || isNaN(Risk_Percentage)) {
      return res.status(400).json({ message: 'Invalid calculation result' });
    }

    // บันทึกผลการคำนวณในฐานข้อมูล
    const insertQuery = 'INSERT INTO Cardiovascular_Risk_Score (Patient_ID, Risk_Score, Risk_Percentage, Risk_Level, Date_Recorded) VALUES (?, ?, ?, ?, NOW())';
    db.query(insertQuery, [patientId, Full_Score, Risk_Percentage, Risk_Level], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving cardiovascular risk score', error: err });
      }

      return res.status(200).json({
        message: 'ASCVD Score calculated successfully',
        score: Full_Score,
        riskPercentage: Risk_Percentage,
        riskLevel: Risk_Level
      });
    });
  });
};
