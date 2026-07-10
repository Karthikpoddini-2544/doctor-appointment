const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/docModel");
const User = require("../models/userModel");

// Book an appointment
const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, doctorInfo, userInfo, date } = req.body;
    const document = req.file ? req.file.filename : "";

    const newAppointment = new Appointment({
      doctorId,
      userId: req.userId,
      doctorInfo: JSON.parse(doctorInfo),
      userInfo: JSON.parse(userInfo),
      date,
      document,
      status: "pending",
    });
    await newAppointment.save();

    // Notify doctor
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
      const doctorUser = await User.findById(doctor.userId);
      if (doctorUser) {
        const parsedUserInfo = JSON.parse(userInfo);
        doctorUser.notification.push({
          type: "new-appointment-request",
          message: `New appointment request from ${parsedUserInfo.fullName} on ${date}`,
          data: { onClickPath: "/doctor-appointments" },
        });
        await doctorUser.save();
      }
    }

    res.status(201).json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message, success: false });
  }
};

// Get all appointments (admin)
const getAllAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", success: false });
  }
};

// Get user's own appointments
const getUserAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", success: false });
  }
};

module.exports = {
  bookAppointmentController,
  getAllAppointmentsController,
  getUserAppointmentsController,
};
