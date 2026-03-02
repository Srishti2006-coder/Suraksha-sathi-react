const express = require("express");
const router = express.Router();
const SafetyPoint = require("../models/SafetyPoint");
const Report = require("../models/Report");
const https = require("https");
const http = require("http");

// Helper function to make HTTP requests
const makeRequest = (url, needsUserAgent = false) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        
        const options = {};
        if (needsUserAgent) {
            options.headers = {
                'User-Agent': 'SurakshaSathi/1.0'
            };
        }
        
        const req = client.request(url, options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on("error", reject);
        req.end();
    });
};

// Geocode endpoint - convert place name to coordinates using Nominatim
router.get("/geocode", async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.status(400).json({ msg: "Search query too short" });
        }
        
        // Use Nominatim (OpenStreetMap) for geocoding
        const encodedQuery = encodeURIComponent(q);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5&addressdetails=1`;
        
        const data = await makeRequest(url, true);
        
        if (!data || data.length === 0) {
            return res.json({ results: [] });
        }
        
        const results = data.map(item => ({
            place_id: item.place_id,
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type,
            address: item.address
        }));
        
        res.json({ results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get route between two points using OSRM
router.get("/route", async (req, res) => {
    try {
        const { startLat, startLng, endLat, endLng } = req.query;
        
        if (!startLat || !startLng || !endLat || !endLng) {
            return res.status(400).json({ msg: "Start and end coordinates required" });
        }
        
        // Use OSRM public API for routing
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
        
        const data = await makeRequest(url);
        
        if (data.code !== "Ok") {
            return res.status(400).json({ msg: "No route found" });
        }
        
        const route = data.routes[0];
        
        // Extract coordinates from the route geometry
        const coordinates = route.geometry.coordinates.map(coord => ({
            lng: coord[0],
            lat: coord[1]
        }));
        
        // Get alternative routes
        const alternatives = data.routes.slice(1).map(r => ({
            distance: r.distance,
            duration: r.duration,
            geometry: r.geometry.coordinates.map(coord => ({ lng: coord[0], lat: coord[1] }))
        }));
        
        res.json({
            distance: route.distance,
            duration: route.duration,
            geometry: coordinates,
            alternatives: alternatives,
            steps: route.legs[0].steps
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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
        
        // Sample coordinates along the route for safety check
        const sampledCoords = sampleCoordinates(coordinates, 20);
        
        // Check each sampled coordinate on the route
        for (const coord of sampledCoords) {
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
        
        // Get safety points along the route
        const safetyPointsAlongRoute = safetyPoints.filter(sp => {
            return sampledCoords.some(coord => calculateDistance(coord.lat, coord.lng, sp.lat, sp.lng) < 0.5);
        });
        
        // Get reports along the route
        const reportsAlongRoute = reports.filter(report => {
            return sampledCoords.some(coord => calculateDistance(coord.lat, coord.lng, report.lat, report.lng) < 0.3);
        });
        
        res.json({ 
            score: Math.round(normalizedScore * 10) / 10,
            details: {
                policeStations: safetyPointsAlongRoute.filter(sp => sp.type === "police").length,
                hospitals: safetyPointsAlongRoute.filter(sp => sp.type === "hospital").length,
                markets: safetyPointsAlongRoute.filter(sp => sp.type === "market" || sp.type === "mall").length,
                reports: reportsAlongRoute.length
            },
            safetyPoints: safetyPointsAlongRoute,
            unsafePoints: reportsAlongRoute
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sample coordinates evenly along the route
function sampleCoordinates(coordinates, numSamples) {
    if (coordinates.length <= numSamples) return coordinates;
    
    const result = [];
    const step = (coordinates.length - 1) / (numSamples - 1);
    
    for (let i = 0; i < numSamples; i++) {
        const index = Math.min(Math.floor(i * step), coordinates.length - 1);
        result.push(coordinates[index]);
    }
    
    return result;
}

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
