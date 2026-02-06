const Campaign = require("../models/Campaign");

exports.createCampaign = async (req, res) => {
  const { title, goal, deadline, skinName } = req.body;

  const campaign = new Campaign({
    title,
    goal,
    deadline,
    skinName,
    blockchainId: null,
  });

  await campaign.save();
  res.json(campaign);
};

exports.getCampaigns = async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
};

exports.attachBlockchainId = async (req, res) => {
  const { id } = req.params;
  const { blockchainId } = req.body;

  const campaign = await Campaign.findById(id);
  campaign.blockchainId = blockchainId;
  await campaign.save();

  res.json({ msg: "Blockchain ID attached" });
};
