const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// ── Yardımcı: Tekil (singleton) kaydı getir/oluştur
async function getSingleton() {
  let s = await Settings.findOne({});
  if (!s) s = await Settings.create({});
  return s;
}

// ── PUBLIC: Frontend'in GA bilgilerini güvenli şekilde alması için
// (Auth yok; yalnızca gerekli alanlar döner)
router.get("/public", async (_req, res) => {
  try {
    const s = await getSingleton();
    res.json({
      gaEnabled: !!s.gaEnabled,
      gaMeasurementId: s.gaMeasurementId || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Public ayarlar alınamadı" });
  }
});

// ── ADMIN: Tüm ayarları getir (site + GA)
router.get("/", async (_req, res) => {
  try {
    const s = await getSingleton();
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar alınamadı" });
  }
});

router.put("/", async (req, res) => {
  const { siteTitle, siteDescription, gaEnabled, gaMeasurementId } = req.body;
  try {
    const s = await getSingleton();

    if (typeof siteTitle === "string") s.siteTitle = siteTitle;
    if (typeof siteDescription === "string")
      s.siteDescription = siteDescription;

    // GA alanları (Faz 1)
    if (typeof gaEnabled === "boolean") s.gaEnabled = gaEnabled;
    if (typeof gaMeasurementId === "string")
      s.gaMeasurementId = gaMeasurementId.trim();

    await s.save();
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: "Ayarlar güncellenemedi" });
  }
});

module.exports = router;
