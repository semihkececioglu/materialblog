const express = require("express");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const router = express.Router();

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
});
const propertyId = process.env.GA4_PROPERTY_ID;

// Google Analytics - Time Series Data (last 7 days by default)
router.get("/overview", async (req, res) => {
  try {
    const { startDate = "7daysAgo", endDate = "today" } = req.query;

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "activeUsers" }, { name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "page_view" },
        },
      },
    });

    res.json(response);
  } catch (err) {
    console.error("GA overview error:", JSON.stringify(err, null, 2));
    res.status(500).json({
      message: "GA overview alınamadı",
      error: err.message,
    });
  }
});

// Google Analytics - Time Series (active users + page views over time)
router.get("/timeseries", async (req, res) => {
  try {
    const { startDate = "7daysAgo", endDate = "today" } = req.query;

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "page_view" },
        },
      },
    });

    res.json(response);
  } catch (err) {
    console.error("GA timeseries error:", JSON.stringify(err, null, 2));
    res.status(500).json({
      message: "GA timeseries alınamadı",
      error: err.message,
    });
  }
});

// Google Analytics - Top Pages
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
      metrics: [{ name: "eventCount" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: Number(limit),
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "page_view" },
        },
      },
    });

    res.json(response);
  } catch (err) {
    console.error("GA top-pages error:", JSON.stringify(err, null, 2));
    res.status(500).json({
      message: "GA top pages alınamadı",
      error: err.message,
    });
  }
});

module.exports = router;
