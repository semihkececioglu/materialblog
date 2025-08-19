const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: "Material Blog" },
    siteDescription: { type: String, default: "" },
    gaEnabled: { type: Boolean, default: false },
    gaMeasurementId: { type: String, default: "" }, // Örn: G-ABCD1234
  },
  { timestamps: true }
);

// Tekil kayıt (singleton) yaklaşımı: ilk istek geldiğinde yoksa oluşturur
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model("Setting", settingsSchema);
