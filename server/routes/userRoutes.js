const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerController,
  loginController,
  authController,
  getAllUsersController,
  getAllNotificationsController,
  markAllReadController,
  deleteAllNotificationsController,
} = require("../controllers/userController");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/getUserData", authMiddleware, authController);
router.get("/getallusers", authMiddleware, getAllUsersController);
router.get("/getallnotifications", authMiddleware, getAllNotificationsController);
router.post("/markallread", authMiddleware, markAllReadController);
router.post("/deleteallnotifications", authMiddleware, deleteAllNotificationsController);

module.exports = router;
