const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ฟังก์ชัน Verify Google ID Token
async function verifyGoogleToken(token) {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return { googleId: payload.sub, name: payload.name, email: payload.email, picture: payload.picture };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}

// ฟังก์ชันสมัครสมาชิก (แบบปกติ)
exports.registerUser = async (req, res) => {
    const { username, name, email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Username หรือ Email นี้มีผู้ใช้งานแล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertResult] = await db.execute('INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)', [username, name, email, hashedPassword]);

        res.status(201).json({ message: 'ลงทะเบียนผู้ใช้สำเร็จ โปรดรอการอนุมัติจาก Admin', userId: insertResult.insertId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียนผู้ใช้', error: error.message });
    }
};

// ฟังก์ชันสมัครด้วย Google
exports.registerGoogleUser = async (req, res) => {
    const { googleIdToken, username, name, email, password } = req.body; // รับ password เพิ่มเติม
    const googleUser = await verifyGoogleToken(googleIdToken);

    if (!googleUser || googleUser.email !== email) {
        return res.status(400).json({ message: 'Google ID Token ไม่ถูกต้อง' });
    }

    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE google_id = ? OR username = ? OR email = ?', [googleUser.googleId, username, email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Google Account, Username หรือ Email นี้มีผู้ใช้งานแล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // บังคับให้มี password

        const [insertResult] = await db.execute(
            'INSERT INTO users (google_id, username, name, email, password, picture, approved) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [googleUser.googleId, username, googleUser.name, googleUser.email, hashedPassword, googleUser.picture, 0]
        );

        res.status(201).json({ message: 'ลงทะเบียนด้วย Google สำเร็จ โปรดรอการอนุมัติจาก Admin', userId: insertResult.insertId });
    } catch (error) {
        console.error('Error registering Google user:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียนด้วย Google', error: error.message });
        console.log("googleUser", googleUser);
console.log("username", username);
console.log("name", googleUser.name);
console.log("email", googleUser.email);
console.log("password", password);

    }
};

// ฟังก์ชันเข้าระบบด้วย Google
exports.loginGoogleUser = async (req, res) => {
    const { googleIdToken } = req.body;
    const googleUser = await verifyGoogleToken(googleIdToken);

    if (!googleUser) {
        return res.status(400).json({ message: 'Google ID Token ไม่ถูกต้อง' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE google_id = ?', [googleUser.googleId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้ Google นี้' });
        }

        const user = rows[0];
        if (!user.approved) {
            return res.status(403).json({ message: 'บัญชีของคุณยังไม่ได้รับการอนุมัติ' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'เข้าสู่ระบบด้วย Google สำเร็จ', token });
    } catch (error) {
        console.error('Error logging in with Google:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google', error: error.message });
    }
};

// ฟังก์ชันเข้าสู่ระบบ (แบบปกติ)
exports.loginUser = async (req, res) => {
    const { username, password, email } = req.body;

    let identifier;
    let query;

    if (!username && !email) {
        return res.status(400).json({ message: 'กรุณาระบุ Username หรือ Email' });
    }

    if (!password) {
        return res.status(400).json({ message: 'กรุณาระบุรหัสผ่าน' });
    }

    if (username) {
        identifier = username;
        query = 'SELECT * FROM users WHERE username = ?';
    } else if (email) {
        identifier = email;
        query = 'SELECT * FROM users WHERE email = ?';
    }

    try {
        const [rows] = await db.execute(query, [identifier]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'ชื่อผู้ใช้ หรือ Email ไม่ถูกต้อง' });
        }

        const user = rows[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        if (!user.approved) {
            return res.status(403).json({ message: 'บัญชีของคุณยังไม่ได้รับการอนุมัติ' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
};