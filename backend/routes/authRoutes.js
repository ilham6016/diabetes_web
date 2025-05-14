const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ลงทะเบียนผู้ใช้ (แบบปกติ)
router.post('/register', authController.registerUser);

// ลงทะเบียนผู้ใช้ด้วย Google
router.post('/google/register', authController.registerGoogleUser); // เปลี่ยนจาก '/google' เป็น '/google/register' เพื่อความชัดเจน

// ล็อกอินผู้ใช้ (ทั้งแบบปกติและ Google)
router.post('/login', authController.loginUser);

// ล็อกอินผู้ใช้ด้วย Google (ใช้ googleId ที่อนุมัติแล้ว) - เพิ่ม Route นี้
router.post('/google/login', authController.loginGoogleUser);

module.exports = router;