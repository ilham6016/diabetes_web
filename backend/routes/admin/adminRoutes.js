const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");
const { verifyToken, isAdmin } = require("../../middleware/authMiddleware");

router.get("/accounts", verifyToken, isAdmin, adminController.getAllAccounts);
router.patch("/accounts/:userId/approve", verifyToken, isAdmin, adminController.approveAccount);
router.delete("/accounts/:userId", verifyToken, isAdmin, adminController.deleteAccount);
router.patch("/accounts/:userId/reject", verifyToken, isAdmin, adminController.rejectAccount);
router.post("/accounts/add", verifyToken, isAdmin, adminController.AddAccount);
router.put("/accounts/:userId", verifyToken, isAdmin, adminController.editAccount)


module.exports = router;
