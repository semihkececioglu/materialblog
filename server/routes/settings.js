const express = require("express");
const router = express.Router();
const Setting = require("../models/Settings");

// GET /api/settings → tüm ayarlar
router.get("/", async (req, res) => {
  try {
    const settings = await Setting.getSingleton();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar alınamadı" });
  }
});

// GET /api/settings/public → sadece public alanlar
router.get("/public", async (req, res) => {
  try {
    const settings = await Setting.getSingleton();
    res.json({
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
    });
  } catch (err) {
    res.status(500).json({ message: "Public ayarlar alınamadı" });
  }
});

// PUT /api/settings → güncelle
router.put("/", async (req, res) => {
  try {
    let settings = await Setting.getSingleton();
    const { siteTitle, siteDescription } = req.body;

    settings.siteTitle = siteTitle;
    settings.siteDescription = siteDescription;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar güncellenemedi" });
  }
});

module.exports = router;
