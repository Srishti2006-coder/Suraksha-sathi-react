const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, default: "Anonymous" },
    userPhone: { type: String, default: "" },
    type: { 
        type: String, 
        enum: ["assault", "theft", "harassment", "suspicious", "other"],
        required: true 
    },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    note: { type: String, default: "" },
    isSafe: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
