const mongoose = require("mongoose");

const sosLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    message: { type: String, default: "" },
    contactsNotified: { type: Array, default: [] },
    status: { type: String, default: "sent" }
}, { timestamps: true });

module.exports = mongoose.model("SOSLog", sosLogSchema);
