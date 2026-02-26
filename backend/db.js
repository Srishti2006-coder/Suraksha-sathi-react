// backend/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)  // bas itna hi, extra options hata do
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;