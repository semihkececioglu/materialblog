const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const analytics = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL, // env den çekecek
    private_key: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

module.exports = analytics;
