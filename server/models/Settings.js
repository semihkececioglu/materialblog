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

      // META Pixel alanları
      metaPixelEnabled: settings.metaPixelEnabled,
      metaPixelId: settings.metaPixelId,
    });
  } catch (err) {
    res.status(500).json({ message: "Public ayarlar alınamadı" });
  }
});

//

// PUT /api/settings → güncelle
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
    res.status(500).json({ message: "Ayarlar güncellenemedi" });
  }
});

module.exports = router;
