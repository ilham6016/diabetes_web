const express = require("express");
const router = express.Router();
const {exportPDF,exportExcel,getPreviewNames,getAllPatients} = require("../../controllers/Export/exportController");
const { verifyToken } = require("../../middleware/authMiddleware");

// ✅ Export PDF: ใช้ ?id=1,2,3
router.get("/pdf", verifyToken, exportPDF); 

router.get("/excel", verifyToken, exportExcel); 

// ✅ ดึงเฉพาะชื่อผู้ป่วย: ใช้ใน preview modal
router.get("/preview-names", getPreviewNames);
router.get("/all-patients", getAllPatients);

module.exports = router;
