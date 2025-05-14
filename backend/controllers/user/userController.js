const pool = require("../../config/db"); // ใช้สำหรับการเชื่อมต่อฐานข้อมูล

// ดึงข้อมูลโปรไฟล์ของผู้ใช้const pool = require("../../config/db");

// ฟังก์ชันสำหรับดึงโปรไฟล์ผู้ใช้
exports.getMe = async (req, res) => {
  const userId = req.user.id; // ดึงข้อมูล ID ผู้ใช้จาก JWT
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, name, email, picture, role, approved, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ profile: rows[0] }); // ส่งข้อมูลโปรไฟล์กลับไปยัง Frontend
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};


// แก้ไขข้อมูลโปรไฟล์ของผู้ใช้
exports.updateMe = async (req, res) => {
  const userId = req.user.id; // ดึง ID ผู้ใช้จาก JWT
  const { username, email } = req.body; // ข้อมูลใหม่ที่ส่งมาจากผู้ใช้
  try {
    await pool.execute("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, userId]);
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

// ลบบัญชีผู้ใช้
exports.deleteMe = async (req, res) => {
  const userId = req.user.id; // ดึง ID ผู้ใช้จาก JWT
  try {
    await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Failed to delete user account" });
  }
};

// อนุมัติผู้ใช้ (กรณีใช้ร่วมกับ Admin)
exports.approveUser = async (req, res) => {
  const { userId } = req.params; // ดึง userId จาก URL
  try {
    await pool.execute("UPDATE users SET approved = 1 WHERE id = ?", [userId]);
    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Failed to approve user" });
  }
};

// ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
exports.getUserInfo = async (req, res) => {
  const userId = req.user.id; // ดึง userId จาก JWT (middleware ต้องตรวจสอบก่อน)
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, name, email, picture, role, approved, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ profile: rows[0] }); // ส่งข้อมูลผู้ใช้กลับไปยัง Frontend
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('ดึงข้อมูลผู้ใช้ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};