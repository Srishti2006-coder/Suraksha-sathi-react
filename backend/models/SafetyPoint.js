const mongoose = require("mongoose");

const safetyPointSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ["police", "hospital", "market", "mall"],
        required: true 
    },
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    weight: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model("SafetyPoint", safetyPointSchema);
