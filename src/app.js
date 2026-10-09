const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// Routes
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Lotus Light Ecommerce API is running"
    });
});

module.exports = app;