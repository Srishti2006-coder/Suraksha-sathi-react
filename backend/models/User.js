const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ['female', 'male', 'other'], default: "" },
    emergencyContacts: { 
        type: Array, 
        default: [] 
    },
    voiceCommand: { type: String, default: "" },
    reportsCount: { type: Number, default: 0 },
    sosCount: { type: Number, default: 0 },
    safeRoutesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
