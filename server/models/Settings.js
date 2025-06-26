const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: "Material Blog" },
  siteDescription: { type: String, default: "" },
});

module.exports = mongoose.model("Setting", settingsSchema);
