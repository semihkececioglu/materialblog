const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ message: "Kullanıcı zaten mevcut." });

    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
    });
    await newUser.save();

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log("Gelen login verisi:", req.body);

    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      console.log("Kullanıcı bulunamadı.");
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Şifre eşleşmedi.");
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    console.error("Login sırasında hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
