const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// Get settings
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar alınamadı" });
  }
});

// Update settings
router.put("/", async (req, res) => {
  const { siteTitle, siteDescription } = req.body;
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({ siteTitle, siteDescription });
    } else {
      settings.siteTitle = siteTitle;
      settings.siteDescription = siteDescription;
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar güncellenemedi" });
  }
});

module.exports = router;
