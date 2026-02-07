const Skin = require("../models/Skin");
const User = require("../models/User");

const createSkin = async (req, res) => {
  try {
    const { name, priceSTM, description, image } = req.body;

    if (!name || !priceSTM) {
      return res.status(400).json({ msg: "Name and priceSTM are required" });
    }

    const skin = new Skin({ name, priceSTM, description, image });
    await skin.save();

    res.json(skin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating skin" });
  }
};

const getSkins = async (req, res) => {
  try {
    const skins = await Skin.find();
    res.json(skins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching skins" });
  }
};

const buySkin = async (req, res) => {
  try {
    const { skinId, transactionHash } = req.body;

    if (!skinId || !transactionHash) {
      return res.status(400).json({ msg: "skinId and transactionHash are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const skin = await Skin.findById(skinId);
    if (!skin) {
      return res.status(404).json({ msg: "Skin not found" });
    }

    if (skin.owner && skin.owner === user.walletAddress) {
      return res.status(400).json({ msg: "You already own this skin" });
    }

    if (skin.owner) {
      return res.status(400).json({ msg: "Skin already owned by someone else" });
    }

    // Note: In production, you should verify the transaction on blockchain
    // For now, we trust that the frontend sent the transaction
    // The blockchainListener will update ownership when event is emitted

    res.json({ 
      msg: "Skin purchase initiated. Waiting for blockchain confirmation.",
      transactionHash 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error purchasing skin" });
  }
};

const getOwnedSkins = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const ownedSkins = await Skin.find({ owner: user.walletAddress });
    res.json(ownedSkins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching owned skins" });
  }
};

module.exports = {
  createSkin,
  getSkins,
  buySkin,
  getOwnedSkins,
};
