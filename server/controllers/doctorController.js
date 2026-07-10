const Doctor = require("../models/docModel");
const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");

// Apply as Doctor
const applyDoctorController = async (req, res) => {
  try {
    const { userId, fullName, email, phone, address, specialisation, experience, fees, timings } = req.body;

    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "You have already applied as a doctor", success: false });
    }

    const newDoctor = new Doctor({
      userId,
      fullName,
      email,
      phone,
      address,
      specialisation,
      experience,
      fees,
      timings,
      status: "pending",
    });
    await newDoctor.save();

    // Notify admin
    const adminUsers = await User.find({ type: "admin" });
    for (const admin of adminUsers) {
      admin.notification.push({
        type: "apply-doctor-request",
        message: `${fullName} has applied for a doctor account`,
        data: { doctorId: newDoctor._id, name: fullName, onClickPath: "/admin/doctors" },
      });
      await admin.save();
    }

    res.status(201).json({ message: "Doctor application submitted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error applying as doctor", error: error.message, success: false });
  }
};

// Get all approved doctors (for patients to browse)
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", success: false });
  }
};

// Get all doctors for admin
const getAllDoctorsForAdminController = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", success: false });
  }
};

// Admin approve doctor
const approveDoctorController = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found", success: false });

    doctor.status = "approved";
    await doctor.save();

    // Update user isdoctor flag
    const user = await User.findById(doctor.userId);
    if (user) {
      user.isdoctor = true;
      user.notification.push({
        type: "doctor-account-request-approved",
        message: "Your doctor application has been approved!",
        data: { onClickPath: "/notification" },
      });
      await user.save();
    }

    res.status(200).json({ success: true, message: "Doctor approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving doctor", success: false });
  }
};

// Admin reject doctor
const rejectDoctorController = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found", success: false });

    doctor.status = "rejected";
    await doctor.save();

    const user = await User.findById(doctor.userId);
    if (user) {
      user.isdoctor = false;
      user.notification.push({
        type: "doctor-account-request-rejected",
        message: "Your doctor application has been rejected.",
        data: { onClickPath: "/notification" },
      });
      await user.save();
    }

    res.status(200).json({ success: true, message: "Doctor rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting doctor", success: false });
  }
};

// Doctor gets their own appointments
const getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found", success: false });

    const appointments = await Appointment.find({ doctorId: doctor._id });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor appointments", success: false });
  }
};

// Doctor approves appointment
const approveAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found", success: false });

    appointment.status = "approved";
    await appointment.save();

    // Notify patient
    const user = await User.findById(appointment.userId);
    if (user) {
      user.notification.push({
        type: "appointment-approved",
        message: `Your appointment on ${appointment.date} has been approved.`,
        data: { onClickPath: "/appointments" },
      });
      await user.save();
    }

    res.status(200).json({ success: true, message: "Appointment approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving appointment", success: false });
  }
};

// Doctor rejects appointment
const rejectAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found", success: false });

    appointment.status = "rejected";
    await appointment.save();

    const user = await User.findById(appointment.userId);
    if (user) {
      user.notification.push({
        type: "appointment-rejected",
        message: `Your appointment on ${appointment.date} was rejected.`,
        data: { onClickPath: "/appointments" },
      });
      await user.save();
    }

    res.status(200).json({ success: true, message: "Appointment rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting appointment", success: false });
  }
};

module.exports = {
  applyDoctorController,
  getAllDoctorsController,
  getAllDoctorsForAdminController,
  approveDoctorController,
  rejectDoctorController,
  getDoctorAppointmentsController,
  approveAppointmentController,
  rejectAppointmentController,
};
