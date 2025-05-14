const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware สำหรับตรวจสอบสิทธิ์ Admin (ตัวอย่าง)
exports.isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'ไม่พบ Token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assuming your user object in the token has an isAdmin flag
        if (decoded.isAdmin) {
            req.userId = decoded.id;
            next();
        } else {
            return res.status(403).json({ message: 'ไม่ได้รับอนุญาต' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
    }
};

exports.getUnapprovedUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, email FROM users WHERE approved = 0');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching unapproved users:', error);
        res.status(500).json({ message: 'Failed to fetch unapproved users' });
    }
};

exports.approveUser = async (req, res) => {
    const { userId } = req.params;
    try {
        await db.execute('UPDATE users SET approved = 1 WHERE id = ?', [userId]);
        res.status(200).json({ message: `อนุมัติผู้ใช้ ID ${userId} แล้ว` });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: 'Failed to approve user' });
    }
};