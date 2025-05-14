const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");
const { verifyToken } = require("../../middleware/authMiddleware");

router.get("/me", verifyToken, userController.getMe);
router.patch("/me", verifyToken, userController.updateMe);
router.delete("/me", verifyToken, userController.deleteMe);
router.get("/info", verifyToken, userController.getUserInfo);
router.get('/', userController.getAllUsers);

module.exports = router;
