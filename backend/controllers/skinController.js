const Skin = require("../models/Skin");
const User = require("../models/User");

const createSkin = async (req, res) => {
  const { name, baseTokenPrice, description } = req.body;

  const skin = new Skin({ name, baseTokenPrice, description });
  await skin.save();

  res.json(skin);
};

const getSkins = async (req, res) => {
  const skins = await Skin.find();
  res.json(skins);
};

const buySkin = async (req, res) => {
  const { skinName } = req.body;

  const user = await User.findById(req.user.id);

  if (user.ownedSkins.includes(skinName)) {
    return res.status(400).json({ msg: "Skin already owned" });
  }

  user.ownedSkins.push(skinName);
  await user.save();

  res.json({ msg: "Skin purchased" });
};

const getOwnedSkins = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.ownedSkins);
};

module.exports = {
  createSkin,
  getSkins,
  buySkin,
  getOwnedSkins,
};
