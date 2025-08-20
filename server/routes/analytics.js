const express = require("express");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const router = express.Router();

// Service account json (Railway env üzerinden okunuyor)
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
});

// GA4 Property ID
const propertyId = process.env.GA4_PROPERTY_ID;

// ✅ Örnek endpoint: Son 7 gün aktif kullanıcı sayısı
router.get("/overview", async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }],
    });

    res.json(response);
  } catch (err) {
    console.error("GA hata:", err.message);
    res.status(500).json({ message: "GA verisi alınamadı" });
  }
});

module.exports = router;
