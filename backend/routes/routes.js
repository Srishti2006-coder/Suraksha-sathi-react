const express = require("express");
const router = express.Router();
const SafetyPoint = require("../models/SafetyPoint");
const Report = require("../models/Report");

// Calculate safety score for a route
router.post("/safety-score", async (req, res) => {
    try {
        const { coordinates } = req.body;
        
        if (!coordinates || coordinates.length < 2) {
            return res.status(400).json({ msg: "At least 2 coordinates required" });
        }
        
        // Get all safety points
        const safetyPoints = await SafetyPoint.find();
        
        // Get all reports
        const reports = await Report.find();
        
        let totalScore = 0;
        let pointsChecked = 0;
        
        // Check each coordinate on the route
        for (const coord of coordinates) {
            const { lat, lng } = coord;
            
            // Check proximity to safety points
            for (const sp of safetyPoints) {
                const distance = calculateDistance(lat, lng, sp.lat, sp.lng);
                const threshold = 0.5; // 500 meters
                
                if (distance < threshold) {
                    if (sp.type === "police") totalScore += 5;
                    else if (sp.type === "hospital") totalScore += 4;
                    else if (sp.type === "market" || sp.type === "mall") totalScore += 3;
                }
            }
            
            // Check proximity to user reports (unsafe areas)
            for (const report of reports) {
                const distance = calculateDistance(lat, lng, report.lat, report.lng);
                const threshold = 0.3; // 300 meters
                
                if (distance < threshold) {
                    totalScore -= 3;
                }
            }
            
            pointsChecked++;
        }
        
        // Normalize score to 1-5 scale
        const avgScore = pointsChecked > 0 ? totalScore / pointsChecked : 0;
        const normalizedScore = Math.max(1, Math.min(5, (avgScore + 10) / 4));
        
        res.json({ 
            score: Math.round(normalizedScore * 10) / 10,
            details: {
                policeStations: safetyPoints.filter(sp => sp.type === "police").length,
                hospitals: safetyPoints.filter(sp => sp.type === "hospital").length,
                reports: reports.length
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = router;
