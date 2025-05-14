// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Route สำหรับดึงรายชื่อผู้ป่วยทั้งหมด
router.get('/', patientController.getPatients);

// Route สำหรับเพิ่มผู้ป่วย
router.post('/', patientController.addPatient);

// Route สำหรับดึงข้อมูลผู้ป่วยตาม ID
router.get('/:id', patientController.getPatientById);

// Route สำหรับแก้ไขข้อมูลผู้ป่วย
router.put('/:id', patientController.updatePatient);

// Route สำหรับลบข้อมูลผู้ป่วย
router.delete('/:id', patientController.deletePatient);

module.exports = router;
