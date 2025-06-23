// server/routes/comments.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment.model");

// ✅ GET: Belirli bir yazıya ait tüm yorumları al
// GET /api/comments?postId=abc123
router.get("/", async (req, res) => {
  try {
    const { postId } = req.query;
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Yorumlar alınamadı." });
  }
});

// ✅ POST: Yeni yorum veya yanıt ekle
// POST /api/comments
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Yorum eklenemedi." });
  }
});

// ✅ DELETE: Yorumu (ve varsa alt yanıtlarını) sil
// DELETE /api/comments/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Önce ana yorumu sil
    await Comment.findByIdAndDelete(id);

    // Sonra varsa ona bağlı yanıtları da sil
    await Comment.deleteMany({ parentId: id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Silme işlemi başarısız." });
  }
});

// ✅ PUT: Yorumu güncelle
// PUT /api/comments/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Yorum güncellenemedi." });
  }
});

module.exports = router;
