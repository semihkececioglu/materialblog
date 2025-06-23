const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Tüm postları al
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası!" });
  }
});

// Tekil postu ID ile getir
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Yazı bulunamadı" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Yeni post oluştur
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: "Geçersiz veri!" });
  }
});

// Post güncelle
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ error: "Yazı bulunamadı" });
    }
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Post sil
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Yazı bulunamadı" });
    }
    res.json({ message: "Yazı silindi" });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.categorySlug = category; // dikkat: slug alanına göre filtreliyoruz
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Postları alırken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
