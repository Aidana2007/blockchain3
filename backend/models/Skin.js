const mongoose = require("mongoose");

const skinSchema = new mongoose.Schema({
  name: String,
  baseTokenPrice: Number,
  description: String,
});

module.exports = mongoose.model("Skin", skinSchema);
