const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashed });
  await user.save();

  res.json({ msg: "User registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { user: { id: user._id } },
    "secretkey",
    { expiresIn: "1h" }
  );

  res.json({ token });
};

exports.connectWallet = async (req, res) => {
  const { walletAddress } = req.body;

  const user = await User.findById(req.user.id);
  user.walletAddress = walletAddress;
  await user.save();

  res.json({ msg: "Wallet connected" });
};
