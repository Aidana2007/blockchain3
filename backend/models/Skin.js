const mongoose = require("mongoose");

const skinSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  priceSTM: { type: Number, required: true },
  description: String,
  image: String,
  owner: { type: String, default: null }, // wallet address of owner, null if not owned
});

module.exports = mongoose.model("Skin", skinSchema);
