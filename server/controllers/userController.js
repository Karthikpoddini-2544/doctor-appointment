const User = require("../models/userModel");
const Doctor = require("../models/docModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerController = async (req, res) => {
  try {
    const { fullName, email, password, phone, type } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword, phone, type });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message, success: false });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        type: user.type,
        isdoctor: user.isdoctor,
        notification: user.notification,
        seennotification: user.seennotification,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message, success: false });
  }
};

// Auth user info
const authController = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Auth error", error: error.message, success: false });
  }
};

// Get all users (admin)
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", success: false });
  }
};

// Get all notifications
const getAllNotificationsController = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });
    res.status(200).json({ success: true, data: { notification: user.notification, seennotification: user.seennotification } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", success: false });
  }
};

// Mark all notifications as read
const markAllReadController = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    res.status(200).json({ success: true, message: "All notifications marked as read", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications", success: false });
  }
};

// Delete all read notifications
const deleteAllNotificationsController = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.seennotification = [];
    await user.save();

    res.status(200).json({ success: true, message: "All read notifications deleted", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notifications", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  getAllUsersController,
  getAllNotificationsController,
  markAllReadController,
  deleteAllNotificationsController,
};
