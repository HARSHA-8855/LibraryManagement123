// routes/users.js
const express = require("express");
const User = require("../backend/user");
const bcrypt = require("bcrypt");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "✅ User registered successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "❌ Error registering user", error });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "❌ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid password" });
    }

    res.json({ message: "✅ User logged in successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error });
  }
});

module.exports = router;
