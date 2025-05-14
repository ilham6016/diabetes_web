// routes/report/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report/reportController');

// ดึงรายชื่อผู้ป่วยทั้งหมด
router.get('/patients', reportController.getPatients);

// ดึงข้อมูลรายงานผู้ป่วยรายบุคคล
router.get('/patient/:id', reportController.getReportByPatientId);

// ดึงแนวโน้มข้อมูลสุขภาพ (health trends)
router.get('/healthTrends/:id', reportController.getHealthTrends);

module.exports = router;