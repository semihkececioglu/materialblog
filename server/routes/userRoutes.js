const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET /api/users → Tüm kullanıcıları getir
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error("Kullanıcılar alınamadı:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// ✅ GET /api/users/:username → Tek bir kullanıcıyı getir
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

// ✅ PUT /api/users/:username → Kullanıcı profilini güncelle
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
