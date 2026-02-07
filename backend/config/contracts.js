/**
 * Contract Configuration
 * Contains ABIs and helper functions for interacting with smart contracts
 */

// Contract ABIs
const STEAM_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

const CROWDFUNDING_ABI = [
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256) view returns (string title, uint256 goal, uint256 deadline, uint256 amountRaised, address creator, bool finalized)",
  "function createCampaign(string memory _title, uint256 _goal, uint256 _duration) external",
  "function fundCampaign(uint256 _id) external payable",
  "function finalize(uint256 _id) external",
  "event CampaignCreated(uint256 id, string title, uint256 goal, uint256 deadline)",
  "event Funded(uint256 id, address user, uint256 amount)",
  "event Finalized(uint256 id)",
];

const SKIN_PAYMENT_ABI = [
  "function buySkin(uint256 skinId, uint256 price) external",
  "function steamToken() view returns (address)",
  "function platformOwner() view returns (address)",
  "function platformFeePercent() view returns (uint256)",
  "event SkinPurchased(address indexed buyer, uint256 indexed skinId, uint256 price, uint256 platformFee)",
];

// Get contract addresses from environment
const getContractAddresses = () => {
  return {
    steamToken: process.env.STEAM_TOKEN_ADDRESS || "",
    crowdfunding: process.env.CROWDFUNDING_ADDRESS || "",
    skinPayment: process.env.SKIN_PAYMENT_ADDRESS || "",
  };
};

module.exports = {
  STEAM_TOKEN_ABI,
  CROWDFUNDING_ABI,
  SKIN_PAYMENT_ABI,
  getContractAddresses,
};
