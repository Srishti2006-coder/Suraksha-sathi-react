const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const User = require("../models/User");
const { verifyToken } = require("./auth");

// Submit a report
router.post("/", verifyToken, async (req, res) => {
    try {
        const { type, lat, lng, note, isSafe } = req.body;
        
        const user = await User.findById(req.user.userId);
        
        const newReport = new Report({
            userId: req.user.userId,
            userName: user ? user.name : "Anonymous",
            userPhone: user ? user.phone : "",
            type,
            lat,
            lng,
            note,
            isSafe: isSafe || false
        });
        
        await newReport.save();
        
        // Update user's report count
        if (user) {
            await User.findByIdAndUpdate(req.user.userId, { $inc: { reportsCount: 1 } });
        }
        
        res.status(201).json({ msg: "Report submitted successfully", report: newReport });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all reports (paginated)
router.get("/", async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 50;
        
        const reports = await Report.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Report.countDocuments();
        
        res.json({ reports, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get nearby reports
router.get("/nearby", async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ msg: "lat and lng are required" });
        }
        
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const radiusKm = parseFloat(radius) || 5; // default 5km
        
        // Approximate degree to km conversion
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(latNum * Math.PI / 180));
        
        const reports = await Report.find({
            lat: { $gte: latNum - latDelta, $lte: latNum + latDelta },
            lng: { $gte: lngNum - lngDelta, $lte: lngNum + lngDelta }
        }).sort({ createdAt: -1 });
        
        res.json({ reports });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
