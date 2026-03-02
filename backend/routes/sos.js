const express = require("express");
const router = express.Router();
const SOSLog = require("../models/SOSLog");
const User = require("../models/User");
const { verifyToken } = require("./auth");

// Send SOS alert
router.post("/", verifyToken, async (req, res) => {
    try {
        const { lat, lng, message } = req.body;
        
        if (!lat || !lng) {
            return res.status(400).json({ msg: "Location required" });
        }
        
        const user = await User.findById(req.user.userId);
        
        // Get emergency contacts
        const emergencyContacts = user ? user.emergencyContacts : [];
        
        // Create SOS log
        const sosLog = new SOSLog({
            userId: req.user.userId,
            lat,
            lng,
            message: message || "Emergency SOS Alert",
            contactsNotified: emergencyContacts,
            status: "sent"
        });
        
        await sosLog.save();
        
        // Update user's SOS count
        if (user) {
            await User.findByIdAndUpdate(req.user.userId, { $inc: { sosCount: 1 } });
        }
        
        // Return contacts for frontend to send SMS via Formspree
        res.json({ 
            msg: "SOS alert sent successfully", 
            sosLog,
            emergencyContacts,
            location: {
                lat,
                lng,
                googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
