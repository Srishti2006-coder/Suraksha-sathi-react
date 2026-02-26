const express = require("express");
const mongoose = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Backend running ✅"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));