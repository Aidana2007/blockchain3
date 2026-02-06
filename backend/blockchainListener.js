const { ethers } = require("ethers");
const Campaign = require("./models/Campaign");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const crowdfundingAddress = process.env.CROWDFUNDING_ADDRESS;

const abi = [
  "event CampaignCreated(uint256 campaignId,string title,string skinName,uint256 goal,uint256 deadline,address creator)"
];

const contract = new ethers.Contract(crowdfundingAddress, abi, provider);

const listen = () => {
  contract.on("CampaignCreated", async (id, title, skinName, goal, deadline, creator) => {
    console.log("New campaign from blockchain:", id.toString());

    const campaign = new Campaign({
      title,
      goal: Number(goal),
      deadline: new Date(Number(deadline) * 1000),
      skinName,
      blockchainId: Number(id),
    });

    await campaign.save();
    console.log("Saved to MongoDB");
  });
};

module.exports = listen;
