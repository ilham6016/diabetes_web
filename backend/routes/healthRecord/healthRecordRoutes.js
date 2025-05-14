// \backend\routes\healthRecord\healthRecordRoutes.js
const express = require('express');
const router = express.Router();
const healthRecordController = require('../../controllers/healthRecord/healthRecordController');

router.post('/add', healthRecordController.createNewHealthRecord);
router.get('/viewById/:recordId', healthRecordController.getHealthRecordById);
router.delete('/delete/:recordId', healthRecordController.deleteHealthRecordById);

module.exports = router;