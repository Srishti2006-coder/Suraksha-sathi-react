const express = require("express");
const router = express.Router();
const SafetyPoint = require("../models/SafetyPoint");

// Get all safety points
router.get("/", async (req, res) => {
    try {
        const safetyPoints = await SafetyPoint.find();
        res.json({ safetyPoints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get safety points by type
router.get("/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const validTypes = ["police", "hospital", "market", "mall"];
        
        if (!validTypes.includes(type)) {
            return res.status(400).json({ msg: "Invalid type" });
        }
        
        const safetyPoints = await SafetyPoint.find({ type });
        res.json({ safetyPoints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
