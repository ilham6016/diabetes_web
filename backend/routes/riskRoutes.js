// routes/riskRoutes.js
const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');

// ตรวจสอบว่าคุณเรียกฟังก์ชันจาก riskController ถูกหรือไม่
router.get('/calculate/:patientId', riskController.calculateASCVDScore);

module.exports = router;
