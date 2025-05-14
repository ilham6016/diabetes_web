const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getPatients,
  deleteAppointment,
  updateAppointment  
} = require("../../controllers/appointment/appointmentController");

const router = express.Router();

router.post("/", createAppointment); // เพิ่มการนัดหมาย
router.get("/", getAppointments); // ดึงรายการการนัดหมายทั้งหมด
router.patch("/status", updateAppointmentStatus); // อัปเดตสถานะ
router.get("/patients", getPatients); // ดึงข้อมูลผู้ป่วย
router.delete("/:Appointment_ID", deleteAppointment); // ลบการนัดหมาย
router.put("/", updateAppointment); // อัปเดตการนัดหมาย

module.exports = router;
