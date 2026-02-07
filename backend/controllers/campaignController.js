const Campaign = require("../models/Campaign");

exports.createCampaign = async (req, res) => {
  try {
    const { title, goal, deadline, creator } = req.body;

    if (!title || !goal || !deadline) {
      return res.status(400).json({ msg: "Title, goal, and deadline are required" });
    }

    const campaign = new Campaign({
      title,
      goal,
      deadline,
      creator,
      blockchainId: null,
    });

    await campaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating campaign" });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching campaigns" });
  }
};

exports.attachBlockchainId = async (req, res) => {
  try {
    const { id } = req.params;
    const { blockchainId } = req.body;

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    campaign.blockchainId = blockchainId;
    await campaign.save();

    res.json({ msg: "Blockchain ID attached", campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error attaching blockchain ID" });
  }
};
