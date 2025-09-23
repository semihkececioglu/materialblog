const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `MBlog İletişim <${process.env.EMAIL_USER}>`, // SPF/DMARC için sabit gönderici
      to: process.env.TO_EMAIL,
      replyTo: `${name} <${email}>`, // dönüşler kullanıcıya gitsin
      subject: `Yeni İletişim Mesajı: ${name}`,
      text: `Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`,
      html: `
        <h2>Yeni İletişim Mesajı</h2>
        <p><b>Ad:</b> ${name}</p>
        <p><b>E-posta:</b> ${email}</p>
        <p><b>Mesaj:</b></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.status(200).json({ message: "Mesaj başarıyla gönderildi" });
  } catch (err) {
    console.error("E-posta hata:", err?.message || err);
    return res.status(500).json({ message: "Mesaj gönderilemedi" });
  }
});

module.exports = router;
