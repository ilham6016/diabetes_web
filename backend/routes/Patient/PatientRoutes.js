const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/Patient/Patient');
const healthController = require('../../controllers/Patient/HealthData');


// ✅ Middleware ป้องกันเซิร์ฟเวอร์ล่มจาก Error
const safeRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
 
// ✅ Patient routes
router.post('/add', safeRoute(patientController.addPatient));
router.get('/all', safeRoute(patientController.getAllPatients));
router.delete('/:id', safeRoute(patientController.deletePatient));

// ✅ Health routes (แนบกับ /api/patient เช่นเดิม)
router.post('/:id/health', safeRoute(healthController.addHealthData));

router.post('/:id/update-color', safeRoute(patientController.updatePatientColorLevel)); // ✅ เพิ่ม route นี้
module.exports = router;