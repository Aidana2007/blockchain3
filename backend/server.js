require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const skinRoutes = require("./routes/skinRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const listenBlockchain = require("./blockchainListener");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skins", skinRoutes);
app.use("/api/campaigns", campaignRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start blockchain listener after server starts
  listenBlockchain();
});
