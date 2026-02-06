const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { register, login, connectWallet } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/connect-wallet", authMiddleware, connectWallet);

module.exports = router;
