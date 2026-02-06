require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
const skinRoutes = require("./routes/skinRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const listenBlockchain = require("./blockchainListener");

connectDB();

app.use("/api/campaigns", campaignRoutes);
app.use("/api/skins", skinRoutes);
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
listenBlockchain();
