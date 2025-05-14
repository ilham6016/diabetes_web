//\backend\models\appointment\appointmentModel.js
const db = require('../../config/db');

async function createHealthRecord(healthData) {
  const [result] = await db.execute(
    `INSERT INTO health_data (Patient_ID, Date_Recorded, Blood_Sugar, Systolic_BP, Diastolic_BP, Weight, Height, Waist, BMI, Blood_Pressure, Smoke, Note, Diabetes_Mellitus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      healthData.Patient_ID, healthData.Date_Recorded, healthData.Blood_Sugar,
      healthData.Systolic_BP, healthData.Diastolic_BP, healthData.Weight,
      healthData.Height, healthData.Waist, healthData.BMI, healthData.Blood_Pressure,
      healthData.Smoke, healthData.Note, healthData.Diabetes_Mellitus
    ]
  );
  return result.insertId;
}
async function getRecord(recordId) {
  try {
    const [record] = await db.execute(`SELECT * FROM health_data WHERE Health_Data_ID = ?`, [recordId]);
    return record.length ? record[0] : null;
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    throw error;
  }
}

async function deleteRecord(recordId) {
  try {
    const [result] = await db.execute(`DELETE FROM health_data WHERE Health_Data_ID = ?`, [recordId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting record by ID:', error);
    throw error;
  }
}

module.exports = {
createHealthRecord,getRecord,
deleteRecord
};
