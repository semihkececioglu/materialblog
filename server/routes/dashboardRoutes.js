const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Category = require("../models/Category");
const Comment = require("../models/comment.model");

router.get("/", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalComments = await Comment.countDocuments();

    res.json({ totalPosts, totalCategories, totalComments });
  } catch (err) {
    res.status(500).json({ error: "Dashboard verileri alınamadı." });
  }
});

module.exports = router;
