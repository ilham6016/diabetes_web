const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "ไม่พบ Token หรือ Token ไม่ถูกต้อง" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token ไม่ถูกต้อง" });
    }
    req.user = user; // เพิ่มข้อมูลผู้ใช้ใน req
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
  }
  next();
};

