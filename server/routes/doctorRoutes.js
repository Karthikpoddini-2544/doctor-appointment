const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  applyDoctorController,
  getAllDoctorsController,
  getAllDoctorsForAdminController,
  approveDoctorController,
  rejectDoctorController,
  getDoctorAppointmentsController,
  approveAppointmentController,
  rejectAppointmentController,
} = require("../controllers/doctorController");

router.post("/applydoctor", authMiddleware, applyDoctorController);
router.get("/getalldoctors", authMiddleware, getAllDoctorsController);
router.get("/getalldoctorsforadmin", authMiddleware, getAllDoctorsForAdminController);
router.post("/approvedoctor/:doctorId", authMiddleware, approveDoctorController);
router.post("/rejectdoctor/:doctorId", authMiddleware, rejectDoctorController);
router.get("/getdoctorappointments", authMiddleware, getDoctorAppointmentsController);
router.post("/approveappointment/:appointmentId", authMiddleware, approveAppointmentController);
router.post("/rejectappointment/:appointmentId", authMiddleware, rejectAppointmentController);

module.exports = router;
