const { ethers } = require("ethers");
const Campaign = require("./models/Campaign");
const Skin = require("./models/Skin");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const crowdfundingAddress = process.env.CROWDFUNDING_ADDRESS;
const skinPaymentAddress = process.env.SKIN_PAYMENT_ADDRESS;

// Crowdfunding ABI
const crowdfundingAbi = [
  "event CampaignCreated(uint256 id, string title, uint256 goal, uint256 deadline)"
];

// SkinPayment ABI
const skinPaymentAbi = [
  "event SkinPurchased(address indexed buyer, uint256 indexed skinId, uint256 price, uint256 platformFee)"
];

const listen = () => {
  // Listen to CampaignCreated events
  if (crowdfundingAddress && crowdfundingAddress !== "") {
    const crowdfundingContract = new ethers.Contract(
      crowdfundingAddress,
      crowdfundingAbi,
      provider
    );

    crowdfundingContract.on(
      "CampaignCreated",
      async (id, title, goal, deadline) => {
        try {
          console.log("New campaign from blockchain:", id.toString());

          const campaign = new Campaign({
            title,
            goal: ethers.formatEther(goal),
            deadline: new Date(Number(deadline) * 1000),
            blockchainId: Number(id),
          });

          await campaign.save();
          console.log("Campaign saved to MongoDB");
        } catch (err) {
          console.error("Error saving campaign:", err);
        }
      }
    );
    console.log("Listening to CampaignCreated events...");
  } else {
    console.warn("CROWDFUNDING_ADDRESS not set, skipping campaign listener");
  }

  // Listen to SkinPurchased events
  if (skinPaymentAddress && skinPaymentAddress !== "") {
    const skinPaymentContract = new ethers.Contract(
      skinPaymentAddress,
      skinPaymentAbi,
      provider
    );

    skinPaymentContract.on(
      "SkinPurchased",
      async (buyer, skinId, price, platformFee) => {
        try {
          console.log("Skin purchased from blockchain:");
          console.log("  Buyer:", buyer);
          console.log("  Skin ID:", skinId.toString());
          console.log("  Price:", ethers.formatUnits(price, 18), "STM");
          console.log("  Platform Fee:", ethers.formatUnits(platformFee, 18), "STM");

          // Find skin by ID and update owner
          const skin = await Skin.findById(skinId.toString());
          if (skin) {
            skin.owner = buyer;
            await skin.save();
            console.log(`Skin "${skin.name}" ownership updated to ${buyer}`);
          } else {
            console.warn(`Skin with ID ${skinId.toString()} not found in database`);
          }
        } catch (err) {
          console.error("Error updating skin ownership:", err);
        }
      }
    );
    console.log("Listening to SkinPurchased events...");
  } else {
    console.warn("SKIN_PAYMENT_ADDRESS not set, skipping skin purchase listener");
  }
};

module.exports = listen;
