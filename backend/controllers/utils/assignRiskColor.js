const db = require('../../config/db');

// ฟังก์ชันแบ่งสีตามปัจจัยเสี่ยง
exports.assignRiskColor = async (patientId) => {
  try {
    // ดึงข้อมูลที่จำเป็นจากฐานข้อมูล
    const [rows] = await db.query(`
      SELECT 
        h.Systolic_BP AS systolic, 
        h.Diastolic_BP AS diastolic, 
        h.Blood_Sugar AS blood_sugar
      FROM health_data h
      WHERE h.Patient_ID = ?
      ORDER BY h.Date_Recorded DESC
      LIMIT 1
    `, [patientId]);

    if (!rows.length) {
      throw new Error('ไม่พบข้อมูลผู้ป่วย');
    }

    const { systolic,diastolic, blood_sugar } = rows[0];

    let color = '';
    
    // การแบ่งกลุ่มสีตามเกณฑ์
    if (systolic <= 120 && diastolic <= 80 && blood_sugar <= 100) {
      color = 'สีขาว';  // กลุ่มปกติ
    } else if (systolic >= 120 && systolic <= 139 && diastolic >= 80 && diastolic <= 89 && blood_sugar >= 100 && blood_sugar <= 125) {
      color = 'สีเขียวอ่อน';  // กลุ่มเสี่ยง
    } else if (systolic <= 139 && diastolic <= 89 && blood_sugar <= 125) {
      color = 'สีเขียวเข้ม';  // กลุ่มป่วยระดับ 0
    } else if (systolic >= 140 && systolic <= 155 && diastolic >= 90 && diastolic <= 99 && blood_sugar >= 126 && blood_sugar <= 154) {
      color = 'สีเหลือง';  // กลุ่มป่วยระดับ 1
    } else if (systolic >= 160 && systolic <= 179 && diastolic >= 100 && diastolic <= 109 && blood_sugar >= 155 && blood_sugar <= 182) {
      color = 'สีส้ม';  // กลุ่มป่วยระดับ 2
    } else if (systolic >= 180 && systolic <= 199 && diastolic >= 110 && diastolic <= 119 && blood_sugar >= 183 && blood_sugar <= 200) {
      color = 'สีแดง';  // กลุ่มป่วยระดับ 3
    } else {
      color = 'สีดำ';  // กลุ่มป่วยที่มีโรคแทรกซ้อน
   }
    
    // อัปเดตคอลัมน์ Color ในฐานข้อมูล
  //  await db.execute('UPDATE patient SET Color = ? WHERE Patient_ID = ?', [color, patientId]);

    return color;

  } catch (err) {
    console.error('Error assigning risk color:', err);
    throw new Error('เกิดข้อผิดพลาดในการคำนวณสีความเสี่ยง');
  }
};
