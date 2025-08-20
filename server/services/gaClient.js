const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const Setting = require("../models/Settings");

let privateKey = process.env.GA4_PRIVATE_KEY || "";
if (privateKey.includes("\\n")) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

const clientEmail = process.env.GA4_CLIENT_EMAIL;

if (!clientEmail || !privateKey) {
  console.error("❌ GA4_CLIENT_EMAIL veya GA4_PRIVATE_KEY tanımlı değil!");
}

const analytics = new BetaAnalyticsDataClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

async function getPropertyId() {
  try {
    const settings = await Setting.getSingleton();
    if (settings && settings.gaPropertyId) {
      return settings.gaPropertyId;
    }
    // Eğer ayarlar tablosunda yoksa env’den al
    if (process.env.GA4_PROPERTY_ID) {
      return process.env.GA4_PROPERTY_ID;
    }
    throw new Error("GA4 Property ID bulunamadı!");
  } catch (err) {
    console.error("getPropertyId hata:", err.message);
    throw err;
  }
}

module.exports = { analytics, getPropertyId };
