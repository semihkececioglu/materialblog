const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags");

// Tüm etiketleri getir
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Yeni etiket ekle
router.post("/", async (req, res) => {
  try {
    const newTag = new Tag({ name: req.body.name });
    const saved = await newTag.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Etiket eklenemedi" });
  }
});

// Etiket güncelle
router.put("/:id", async (req, res) => {
  try {
    const updated = await Tag.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Etiket güncellenemedi" });
  }
});

// Etiket sil
router.delete("/:id", async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Etiket silinemedi" });
  }
});

module.exports = router;
