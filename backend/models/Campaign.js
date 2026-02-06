const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: String,
  goal: Number,
  deadline: Date,
  skinName: String,
  blockchainId: Number,
});

module.exports = mongoose.model("Campaign", campaignSchema);
