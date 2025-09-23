const express = require("express");
const router = express.Router();
const Comment = require("../models/comment.model");

// Get all comments or comments for a specific post
router.get("/", async (req, res) => {
  try {
    const { postId } = req.query;
    const filter = postId ? { postId } : {};

    const comments = await Comment.find(filter)
      .populate("user", "username profileImage bio role")
      .sort({ date: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Yorumlar alınamadı" });
  }
});

// Get latest 5 comments for admin dashboard
router.get("/latest", async (req, res) => {
  try {
    const latestComments = await Comment.find()
      .sort({ date: -1 })
      .limit(5)
      .populate("user", "username profileImage")
      .populate("postId", "title slug");

    res.status(200).json(latestComments);
  } catch (err) {
    console.error("Son yorumlar alınamadı:", err.message);
    res.status(500).json({ message: "Yorumlar alınamadı." });
  }
});

// Add new comment or reply to a comment
router.post("/", async (req, res) => {
  try {
    const { user, postId, parentId, text } = req.body;

    const newComment = new Comment({
      user,
      postId,
      parentId: parentId || null,
      text,
    });

    const saved = await newComment.save();
    const populated = await saved.populate(
      "user",
      "username profileImage bio role"
    );

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: "Yorum eklenemedi." });
  }
});

// Delete comments and its replies
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Comment.findByIdAndDelete(id);
    await Comment.deleteMany({ parentId: id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

// Update comment text
router.put("/:id", async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    ).populate("user", "username profileImage bio role");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Yorum güncellenemedi." });
  }
});

// Like/unlike a comment
router.put("/:id/like", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Kullanıcı adı gerekli." });
  }

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Yorum bulunamadı." });

    const alreadyLiked = comment.likes.includes(username);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((u) => u !== username);
    } else {
      comment.likes.push(username);
    }

    await comment.save();
    const updated = await Comment.findById(comment._id).populate(
      "user",
      "username profileImage bio role"
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Beğeni güncellenemedi." });
  }
});

module.exports = router;
