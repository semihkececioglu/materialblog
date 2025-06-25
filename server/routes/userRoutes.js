const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (error) {
    console.error("Kullanıcı verisi alınırken hata:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
