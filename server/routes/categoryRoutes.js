const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Get all categories
router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

// Create category
router.post("/", async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({ name });
  await newCategory.save();
  res.status(201).json(newCategory);
});

//Update category
router.put("/:id", async (req, res) => {
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.json(updated);
});

// Delete category
router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
