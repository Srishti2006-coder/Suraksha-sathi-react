
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // password ko secure karne ke liye

// Signup route
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check karein agar email already exist karta hai
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "Email already exists" });

        // Password hash karenge
        const hashedPassword = await bcrypt.hash(password, 10);

        // Naya user create karein
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;