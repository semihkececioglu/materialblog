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
      gaEnabled: settings.gaEnabled,
      gaMeasurementId: settings.gaMeasurementId,
    });
  } catch (err) {
    res.status(500).json({ message: "Public ayarlar alınamadı" });
  }
});

// PUT /api/settings → güncelle
router.put("/", async (req, res) => {
  try {
    let settings = await Setting.getSingleton();
    const {
      siteTitle,
      siteDescription,
      gaEnabled,
      gaMeasurementId,
      gaPropertyId,
    } = req.body;

    settings.siteTitle = siteTitle;
    settings.siteDescription = siteDescription;
    settings.gaEnabled = gaEnabled;
    settings.gaMeasurementId = gaMeasurementId;
    settings.gaPropertyId = gaPropertyId;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar güncellenemedi" });
  }
});

module.exports = router;
