//\backend\controllers\healthRecord\healthRecordController.js
const healthRecordModel = require('../../models/healthRecord/healthRecordModel');

async function createNewHealthRecord(req, res) {
  try {
    const { weight, height } = req.body;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    const healthData = {
      Patient_ID: req.body.patientId,
      Date_Recorded: req.body.date,
      Blood_Sugar: req.body.bloodSugar,
      Systolic_BP: req.body.systolicBP,
      Diastolic_BP: req.body.diastolicBP,
      Weight: weight,
      Height: height,
      Waist: req.body.waist,
      BMI: bmi,
      Blood_Pressure: `${req.body.systolicBP}/${req.body.diastolicBP}`,
      Smoke: req.body.smoke,
      Note: req.body.note,
      Diabetes_Mellitus: req.body.diabetesMellitus,
    };

    const recordId = await healthRecordModel.createHealthRecord(healthData);
    res.status(201).json({ message: 'บันทึกข้อมูลสุขภาพสำเร็จ', recordId });
  } catch (error) {
    console.error('Error creating health record:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
}
async function getHealthRecordById(req, res) {
  try {
    const recordId = req.params.recordId;
    const record = await healthRecordModel.getRecord(recordId);

    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ error: 'ไม่พบข้อมูลสุขภาพ' });
    }
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
}

async function deleteHealthRecordById(req, res) {
  try {
    const recordId = req.params.recordId;
    const success = await healthRecordModel.deleteRecord(recordId);

    success
      ? res.status(200).json({ message: 'ลบข้อมูลสำเร็จ' })
      : res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการลบ' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
}

module.exports = {createNewHealthRecord,
  getHealthRecordById,
  deleteHealthRecordById
};
