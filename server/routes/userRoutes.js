const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET /api/users/:username → Kullanıcı bilgisi getir (şifresiz)
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

router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { firstName, lastName } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();

    res.json({
      message: "Profil başarıyla güncellendi",
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
