const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Post = require("../models/Post");

// All categories with postcount
router.get("/", async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "category",
          as: "posts",
        },
      },
      {
        $addFields: {
          postCount: { $size: "$posts" },
        },
      },
      {
        $project: {
          posts: 0,
        },
      },
      { $sort: { name: 1 } },
    ]);

    res.json(categories);
  } catch (err) {
    console.error("Kategori listeleme hatası:", err);
    res.status(500).json({ error: "Kategori listesi alınamadı" });
  }
});

// Create new category
router.post("/", async (req, res) => {
  try {
    const { name, description, color, icon, featured, parent } = req.body;

    const newCategory = new Category({
      name,
      description,
      color,
      icon,
      featured: featured || false,
      parent: parent || null,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Kategori ekleme hatası:", err);
    res.status(500).json({ error: "Kategori eklenemedi" });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const { name, description, color, icon, featured, parent } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, color, icon, featured, parent: parent || null },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Kategori bulunamadı" });

    res.json(updated);
  } catch (err) {
    console.error("Kategori güncelleme hatası:", err);
    res.status(500).json({ error: "Kategori güncellenemedi" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Kategori silme hatası:", err);
    res.status(500).json({ error: "Kategori silinemedi" });
  }
});

module.exports = router;
