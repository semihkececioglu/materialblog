const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Yükleme klasörü ve dosya ismi ayarı
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Yükleme işlemi
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Dosya yüklenemedi" });

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.json({ url: imageUrl });
});

module.exports = router;
