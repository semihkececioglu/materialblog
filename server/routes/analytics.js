const router = require("express").Router();
const analytics = require("../services/gaClient");
const Setting = require("../models/Settings");

// Property ID'yi ayarlardan oku
async function getPropertyId() {
  const s = await Setting.findOne();
  if (!s?.gaEnabled || !s?.gaPropertyId) {
    throw new Error("GA etkin değil veya Property ID eksik.");
  }
  return `properties/${s.gaPropertyId}`;
}

// Örnek: Genel özet
router.get("/overview", async (req, res) => {
  try {
    const property = await getPropertyId();
    const { startDate = "7daysAgo", endDate = "today" } = req.query;

    const [report] = await analytics.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Örnek: Günlük zaman serisi
router.get("/timeseries", async (req, res) => {
  try {
    const property = await getPropertyId();
    const { startDate = "30daysAgo", endDate = "today" } = req.query;

    const [report] = await analytics.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Örnek: En çok ziyaret edilen sayfalar
router.get("/top-pages", async (req, res) => {
  try {
    const property = await getPropertyId();
    const { startDate = "30daysAgo", endDate = "today" } = req.query;

    const [report] = await analytics.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePathPlusQueryString" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
