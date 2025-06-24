const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "temp/" }); // temp klasörü

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "materialblog",
    });

    fs.unlinkSync(req.file.path); // geçici dosyayı sil

    res.json({ url: result.secure_url }); // frontend'e sadece url döner
  } catch (err) {
    console.error("Cloudinary yükleme hatası:", err);
    res.status(500).json({ error: "Görsel yüklenemedi" });
  }
});

module.exports = router;
