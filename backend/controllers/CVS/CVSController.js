const db = require('../../config/db');

exports.calculateCVDRiskByPatientId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        p.Age AS age,
        CASE WHEN p.Gender = 'ชาย' THEN 1 ELSE 0 END AS sex,
        CASE WHEN h.Smoke = 'สูบ' THEN 1 ELSE 0 END AS smoke,
        CASE WHEN h.Diabetes_Mellitus = 'ป่วยเป็นเบาหวาน' THEN 1 ELSE 0 END AS dm,
        h.Systolic_BP AS sbp,
        h.Waist AS waist,
        h.Height AS height
      FROM patient p
      JOIN health_data h ON p.Patient_ID = h.Patient_ID
      WHERE p.Patient_ID = ?
      ORDER BY h.Date_Recorded DESC
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยหรือสุขภาพล่าสุด' });
    }

    const { age, sex, smoke, dm, sbp, waist, height } = rows[0];

    if (!age || !sbp || !waist || !height) {
      return res.status(400).json({ message: 'ข้อมูลไม่เพียงพอสำหรับคำนวณความเสี่ยง' });
    }

    // คำนวณ Full Score
    const fullScore = (0.079 * age) +
                      (0.128 * sex) +
                      (0.019350987 * sbp) +
                      (0.58454 * dm) +
                      (3.512566 * (waist / height)) +
                      (0.459 * smoke);

    // คำนวณความเสี่ยง %
    const riskPercentage = (1 - Math.pow(0.978296, Math.exp(fullScore - 7.720484))) * 100;

    return res.json({
      patient_id: id,
      full_score: fullScore.toFixed(2),
      risk: parseFloat(riskPercentage.toFixed(2))
    });
  } catch (err) {
    console.error('CVD Risk Calculation Error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดระหว่างคำนวณความเสี่ยง' });
  }
};
