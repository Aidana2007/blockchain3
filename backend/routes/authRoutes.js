const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter, apiLimiter } = require("../middleware/rateLimiter");
const { register, login, connectWallet } = require("../controllers/authController");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/connect-wallet", apiLimiter, authMiddleware, connectWallet);

module.exports = router;
