const express = require("express");
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  attachBlockchainId,
} = require("../controllers/campaignController");

router.post("/", createCampaign);
router.get("/", getCampaigns);
router.put("/:id/blockchain", attachBlockchainId);

module.exports = router;
