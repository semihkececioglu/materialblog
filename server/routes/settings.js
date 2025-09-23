const express = require("express");
const router = express.Router();
const Setting = require("../models/Settings");

// Get all settings
router.get("/", async (req, res) => {
  try {
    const settings = await Setting.getSingleton();
    res.json(settings);
  } catch (err) {
    console.error("Settings get error:", err);
    res.status(500).json({ message: "Ayarlar alınamadı" });
  }
});

// Get public settings (site title, description, Meta Pixel)
router.get("/public", async (req, res) => {
  try {
    const settings = await Setting.getSingleton();
    res.json({
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      metaPixelEnabled: settings.metaPixelEnabled,
      metaPixelId: settings.metaPixelId,
    });
  } catch (err) {
    console.error("Settings public error:", err);
    res.status(500).json({ message: "Public ayarlar alınamadı" });
  }
});

// Update settings
router.put("/", async (req, res) => {
  try {
    let settings = await Setting.getSingleton();
    const { siteTitle, siteDescription, metaPixelEnabled, metaPixelId } =
      req.body;

    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (siteDescription !== undefined)
      settings.siteDescription = siteDescription;
    if (metaPixelEnabled !== undefined)
      settings.metaPixelEnabled = metaPixelEnabled;
    if (metaPixelId !== undefined) settings.metaPixelId = metaPixelId;

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ message: "Ayarlar güncellenemedi" });
  }
});

module.exports = router;
