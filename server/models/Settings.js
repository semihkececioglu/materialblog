const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: "Material Blog" },
  siteDescription: { type: String, default: "Modern Blog Platform" },
  metaPixelEnabled: { type: Boolean, default: false }, // Meta Pixel toggle
  metaPixelId: { type: String, default: "" }, // Meta Pixel ID
});

// singleton pattern to ensure only one settings document
SettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Setting", SettingsSchema);
