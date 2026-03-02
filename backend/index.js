const express = require("express");
const mongoose = require("./db");
const cors = require("cors");

const app = express();

// CORS - allow all origins for development
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const reportsRoutes = require("./routes/reports");
const safetyPointsRoutes = require("./routes/safetyPoints");
const routesRoutes = require("./routes/routes");
const sosRoutes = require("./routes/sos");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/safety-points", safetyPointsRoutes);
app.use("/api/routes", routesRoutes);
app.use("/api/sos", sosRoutes);

// Health check
app.get("/", (req, res) => res.send("Backend running ✅"));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
