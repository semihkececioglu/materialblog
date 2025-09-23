const express = require("express");
const { Resend } = require("resend");
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur" });
  }

  try {
    const data = await resend.emails.send({
      from: "MUI BLOG İletişim <onboarding@resend.dev>",
      to: process.env.TO_EMAIL,
      reply_to: email,
      subject: `Yeni İletişim Mesajı: ${name}`,
      html: `
        <h2>Yeni İletişim Mesajı</h2>
        <p><b>Ad:</b> ${name}</p>
        <p><b>E-posta:</b> ${email}</p>
        <p><b>Mesaj:</b></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    console.log("Resend response:", data);
    return res.status(200).json({ message: "Mesaj başarıyla gönderildi" });
  } catch (err) {
    console.error("Resend hata:", err?.message || err);
    return res.status(500).json({ message: "Mesaj gönderilemedi" });
  }
});

module.exports = router;
