const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createSkin, getSkins, buySkin, getOwnedSkins } = require("../controllers/skinController");

router.post("/", createSkin);
router.get("/", getSkins);

router.post("/buy", authMiddleware, buySkin);
router.get("/owned", authMiddleware, getOwnedSkins);

module.exports = router;
