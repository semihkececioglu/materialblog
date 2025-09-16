const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  summary: String,
  content: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

postSchema.pre("save", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
