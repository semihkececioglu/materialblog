const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

//Kayıt
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

// Giriş
router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.finOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Şifre yanlış" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Giriş işlemi sırasında hata oluştu." });
  }
});

module.exports = router;
