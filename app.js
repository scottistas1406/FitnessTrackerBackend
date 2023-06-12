require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api/index");
const cors = require("cors");

// Middleware
app.use(cors());

//Body Parser
app.use(express.json());

// // Health.js Route
// app.get("/api/health", (req, res) => {
//   res.json({ message: "Health.js API is running" });
// });

// API Router
app.use("/api", apiRouter);

module.exports = app;