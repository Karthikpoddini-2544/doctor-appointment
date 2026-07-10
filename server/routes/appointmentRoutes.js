const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const {
  bookAppointmentController,
  getAllAppointmentsController,
  getUserAppointmentsController,
} = require("../controllers/appointmentController");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images and documents are allowed"));
  },
});

router.post("/bookappointment", authMiddleware, upload.single("document"), bookAppointmentController);
router.get("/getallappointments", authMiddleware, getAllAppointmentsController);
router.get("/getuserappointments", authMiddleware, getUserAppointmentsController);

module.exports = router;
