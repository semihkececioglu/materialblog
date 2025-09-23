const mongoose = require("mongoose");
const slugify = require("slugify");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagSlug: { type: String, unique: true },
});

// Update tag slug before saving
tagSchema.pre("save", function (next) {
  if (this.name && !this.tagSlug) {
    this.tagSlug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Tag", tagSchema);
