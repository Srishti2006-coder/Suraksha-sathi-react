const mongoose = require("./db");
const SafetyPoint = require("./models/SafetyPoint");

const safetyPoints = [
    // Police Stations
    { type: "police", name: "Central Police Station", lat: 30.7199, lng: 76.789, weight: 5 },
    { type: "police", name: "North Police Station", lat: 30.7299, lng: 76.779, weight: 5 },
    { type: "police", name: "South Police Station", lat: 30.7099, lng: 76.799, weight: 5 },
    { type: "police", name: "Railway Police Station", lat: 30.7149, lng: 76.784, weight: 5 },
    
    // Hospitals
    { type: "hospital", name: "City General Hospital", lat: 30.7209, lng: 76.790, weight: 4 },
    { type: "hospital", name: "Civil Hospital", lat: 30.7189, lng: 76.788, weight: 4 },
    { type: "hospital", name: "Memorial Hospital", lat: 30.7309, lng: 76.780, weight: 4 },
    { type: "hospital", name: "Emergency Medical Center", lat: 30.7109, lng: 76.795, weight: 4 },
    
    // Markets
    { type: "market", name: "Main Market", lat: 30.7219, lng: 76.791, weight: 3 },
    { type: "market", name: "Nehru Market", lat: 30.7179, lng: 76.787, weight: 3 },
    { type: "market", name: "Sector 17 Market", lat: 30.7319, lng: 76.781, weight: 3 },
    { type: "market", name: "Railway Road Market", lat: 30.7139, lng: 76.793, weight: 3 },
    
    // Malls
    { type: "mall", name: "Elante Mall", lat: 30.7229, lng: 76.792, weight: 3 },
    { type: "mall", name: "City Center Mall", lat: 30.7169, lng: 76.786, weight: 3 },
    { type: "mall", name: "Phoenix Mall", lat: 30.7329, lng: 76.782, weight: 3 },
    { type: "mall", name: "West End Mall", lat: 30.7129, lng: 76.794, weight: 3 }
];

async function seed() {
    try {
        // Clear existing safety points
        await SafetyPoint.deleteMany({});
        console.log("Cleared existing safety points");
        
        // Insert new safety points
        await SafetyPoint.insertMany(safetyPoints);
        console.log("Seeded 16 safety points successfully!");
        
        process.exit(0);
    } catch (err) {
        console.error("Error seeding:", err);
        process.exit(1);
    }
}

seed();
