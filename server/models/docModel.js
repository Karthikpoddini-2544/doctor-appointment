const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      set: (v) => v.charAt(0).toUpperCase() + v.slice(1),
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialisation: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    timings: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
