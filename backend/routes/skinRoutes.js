const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { dbLimiter, apiLimiter } = require("../middleware/rateLimiter");
const { createSkin, getSkins, buySkin, getOwnedSkins } = require("../controllers/skinController");

router.post("/", dbLimiter, createSkin);
router.get("/", dbLimiter, getSkins);

router.post("/buy", apiLimiter, authMiddleware, buySkin);
router.get("/owned", apiLimiter, authMiddleware, getOwnedSkins);

module.exports = router;
