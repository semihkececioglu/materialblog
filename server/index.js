const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const postRoutes = require("./routes/postRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS ayarları (geliştirme aşaması için * yeterli)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ JSON parse middleware (body verisini okuyabilmek için)
app.use(express.json());

// ✅ Statik dosyalar
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Route tanımları
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
    app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
  })
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));
