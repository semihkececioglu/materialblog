// routes/analytics.js
const express = require("express");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const router = express.Router();

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
});
const propertyId = process.env.GA4_PROPERTY_ID;

// ✅ Genel toplam (aktif kullanıcı + pageviews)
router.get("/overview", async (req, res) => {
  try {
    const { startDate = "7daysAgo", endDate = "today" } = req.query;
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    });
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "GA overview alınamadı", error: err.message });
  }
});

// ✅ Zaman serisi (günlük aktif kullanıcı / pageviews)
router.get("/timeseries", async (req, res) => {
  try {
    const { startDate = "7daysAgo", endDate = "today" } = req.query;
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    });
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "GA timeseries alınamadı", error: err.message });
  }
});

// ✅ En çok görüntülenen sayfalar
router.get("/top-pages", async (req, res) => {
  try {
    const {
      startDate = "30daysAgo",
      endDate = "today",
      limit = 10,
    } = req.query;
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: Number(limit),
    });
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "GA top pages alınamadı", error: err.message });
  }
});

module.exports = router;
