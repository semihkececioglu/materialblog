const express = require("express");
const router = express.Router();
const { analytics, getPropertyId } = require("../services/gaClient");

// Overview
router.get("/overview", async (req, res) => {
  try {
    const propertyId = await getPropertyId();
    const { startDate, endDate } = req.query;

    const [response] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "GA overview alınamadı" });
  }
});

// Timeseries
router.get("/timeseries", async (req, res) => {
  try {
    const propertyId = await getPropertyId();
    const { startDate, endDate, metric = "activeUsers" } = req.query;

    const [response] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: metric }],
      dimensions: [{ name: "date" }],
    });

    const rows = response.rows?.map((r) => ({
      date: r.dimensionValues?.[0]?.value,
      value: Number(r.metricValues?.[0]?.value || 0),
    }));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "GA timeseries alınamadı" });
  }
});

// Top Pages
router.get("/top-pages", async (req, res) => {
  try {
    const propertyId = await getPropertyId();
    const { startDate, endDate, limit = 10 } = req.query;

    const [response] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "screenPageViews" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      limit: Number(limit),
    });

    const rows = response.rows?.map((r) => ({
      path: r.dimensionValues?.[0]?.value,
      title: r.dimensionValues?.[1]?.value,
      views: Number(r.metricValues?.[0]?.value || 0),
    }));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "GA top pages alınamadı" });
  }
});

module.exports = router;
