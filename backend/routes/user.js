const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("./auth");

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const { name, phone, emergencyContacts, voiceCommand } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (emergencyContacts) updateData.emergencyContacts = emergencyContacts;
        if (voiceCommand !== undefined) updateData.voiceCommand = voiceCommand;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true }
        ).select("-password");

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's reports
router.get("/reports", verifyToken, async (req, res) => {
    try {
        const Report = require("../models/Report");
        const reports = await Report.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json({ reports });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get SOS history
router.get("/sos-history", verifyToken, async (req, res) => {
    try {
        const SOSLog = require("../models/SOSLog");
        const sosLogs = await SOSLog.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json({ sosLogs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
