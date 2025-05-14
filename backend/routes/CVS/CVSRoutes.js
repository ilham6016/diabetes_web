const express = require('express');
const router = express.Router();
const cvsController = require('../../controllers/CVS/CVSController');

router.get('/calculate/:id', cvsController.calculateCVDRiskByPatientId);

module.exports = router;
