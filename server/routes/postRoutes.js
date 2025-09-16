const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Category = require("../models/Category");

// SLUG İLE POST GETİR (kategori populate)
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("user", "username name profileImage")
      .populate("category", "name slug color icon");

    if (!post) return res.status(404).json({ message: "Yazı bulunamadı" });
    res.json(post);
  } catch (err) {
    console.error("Slug ile yazı alma hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// POST LİSTELEME (arama, kategori, etiket, yazar, sayfalama)
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      category,
      tag,
      author,
      page = 1,
      limit = 6,
    } = req.query;

    const filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    };

    // kategori slug → ObjectId
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        filter.category = cat._id;
      } else {
        return res.json({ posts: [], totalPages: 0, currentPage: 1 });
      }
    }

    if (tag) filter.tags = tag;

    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        filter.user = authorUser._id;
      } else {
        return res.json({ posts: [], totalPages: 0, currentPage: 1 });
      }
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / pageSize);

    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("category", "name slug color icon")
      .populate("user", "username name profileImage");

    res.json({
      posts,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (err) {
    console.error("Post listeleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// SON 5 YAZI
router.get("/latest", async (req, res) => {
  try {
    const latestPosts = await Post.find()
      .sort({ date: -1 })
      .limit(5)
      .select("title slug date image")
      .populate("category", "name slug color icon");

    res.status(200).json(latestPosts);
  } catch (err) {
    console.error("Son yazılar alınamadı:", err.message);
    res.status(500).json({ message: "Yazılar alınamadı." });
  }
});

// ID İLE POST GETİR
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("category", "name slug color icon")
      .populate("user", "username name profileImage");

    if (!post) return res.status(404).json({ error: "Yazı bulunamadı" });
    res.json(post);
  } catch (err) {
    console.error("ID ile yazı alma hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// POST OLUŞTUR
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate(
      "category",
      "name slug color icon"
    );
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Yeni yazı ekleme hatası:", err);
    res.status(400).json({ error: "Geçersiz veri!", details: err });
  }
});

// POST GÜNCELLE
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category", "name slug color icon");

    if (!updatedPost) return res.status(404).json({ error: "Yazı bulunamadı" });
    res.json(updatedPost);
  } catch (err) {
    console.error("Yazı güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// POST SİL
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Yazı bulunamadı" });
    res.json({ message: "Yazı silindi" });
  } catch (err) {
    console.error("Yazı silme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
