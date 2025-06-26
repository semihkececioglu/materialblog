const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// GET /api/posts?search=...&category=...&tag=...&page=...&limit=...
router.get("/", async (req, res) => {
  try {
    const { search = "", category, tag, page = 1, limit = 6 } = req.query;

    let filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    };

    if (category) {
      filter.categorySlug = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / pageSize);

    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      posts,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (err) {
    console.error("Postları alırken hata:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// GET /api/posts/:id – Tekil postu ID ile getir
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

// POST /api/posts – Yeni post oluştur
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: "Geçersiz veri!" });
  }
});

// PUT /api/posts/:id – Post güncelle
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

// DELETE /api/posts/:id – Post sil
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

// POST /api/posts/slug/:slug/like – Beğen / Beğenmekten vazgeç
router.post("/slug/:slug/like", async (req, res) => {
  const { slug } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findOne({ slug });
    const user = await User.findById(userId);

    if (!post || !user) return res.status(404).json({ message: "Bulunamadı" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
      user.likedPosts.pull(post._id);
    } else {
      post.likes.push(userId);
      user.likedPosts.push(post._id);
    }

    await post.save();
    await user.save();

    res.status(200).json({
      liked: !alreadyLiked,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like işlem hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// POST /api/posts/slug/:slug/save – Kaydet / Kaldır
router.post("/slug/:slug/save", async (req, res) => {
  const { slug } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findOne({ slug });
    const user = await User.findById(userId);

    if (!post || !user) return res.status(404).json({ message: "Bulunamadı" });

    const postId = post._id;
    const alreadySaved = user.savedPosts.includes(postId);

    if (alreadySaved) {
      user.savedPosts.pull(postId);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      saved: !alreadySaved,
    });
  } catch (error) {
    console.error("Save işlem hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// GET /api/posts/slug/:slug/like-status?userId=... – Beğeni durumu kontrolü
router.get("/slug/:slug/like-status", async (req, res) => {
  const { slug } = req.params;
  const { userId } = req.query;

  try {
    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(userId);

    res.status(200).json({
      liked,
      likeCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// GET /api/posts/slug/:slug – Slug'a göre tekil yazı getir
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: "Yazı bulunamadı" });
    }

    res.json(post);
  } catch (err) {
    console.error("Slug ile yazı alma hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
