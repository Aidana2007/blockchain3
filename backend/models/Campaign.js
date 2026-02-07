const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  goal: { type: Number, required: true }, // in ETH
  deadline: { type: Date, required: true },
  blockchainId: { type: Number, unique: true, sparse: true },
  creator: { type: String }, // wallet address
  amountRaised: { type: Number, default: 0 },
  finalized: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Campaign", campaignSchema);
