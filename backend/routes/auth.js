require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "suraksha_sathi_super_secret_key_change_in_production";

// Email validation regex
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Signup route
router.post("/signup", async (req, res) => {
    const { name, email, password, phone, gender } = req.body;

    try {
        // Validate email format
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ msg: "Please enter a valid email address" });
        }

        // Validate required fields
        if (!name || !password) {
            return res.status(400).json({ msg: "Name and password are required" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone: phone || "",
            gender: gender || ""
        });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email format
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ msg: "Please enter a valid email address" });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                emergencyContacts: user.emergencyContacts,
                voiceCommand: user.voiceCommand,
                reportsCount: user.reportsCount,
                sosCount: user.sosCount,
                safeRoutesCount: user.safeRoutesCount
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = router;
module.exports.verifyToken = verifyToken;
module.exports.JWT_SECRET = JWT_SECRET;
