const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: "Material Blog" },
  siteDescription: { type: String, default: "Modern Blog Platform" },
});

// Singleton settings kaydı
SettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", SettingsSchema);
