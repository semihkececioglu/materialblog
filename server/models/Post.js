const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  category: String,
  categorySlug: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Her post kaydedilmeden önce categorySlug otomatik üret
postSchema.pre("save", function (next) {
  if (this.category) {
    this.categorySlug = slugify(this.category, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
