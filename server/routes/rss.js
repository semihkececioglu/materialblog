const express = require("express");
const router = express.Router();
const RSS = require("rss");
const Post = require("../models/Post");

router.get("/rss.xml", async (req, res) => {
  try {
    const feed = new RSS({
      title: "Material Blog",
      description: "Material Blog - Son Yazılar",
      feed_url: "https://materialblog.vercel.app/rss.xml",
      site_url: "https://materialblog.vercel.app",
      language: "tr",
      pubDate: new Date(),
      ttl: 60,
    });

    const posts = await Post.find()
      .populate("user", "username name profileImage")
      .populate("category", "name slug color icon")
      .populate("tags", "name tagSlug")
      .sort({ date: -1 }) // şimdilik date alanına göre
      .limit(20);

    posts.forEach((post) => {
      feed.item({
        title: post.title,
        description: `
          <![CDATA[
            <p>${post.summary || post.content?.substring(0, 200)}...</p>
            ${
              post.image
                ? `<img src="${post.image}" alt="${post.title}" width="600"/>`
                : ""
            }
            <p><strong>Kategori:</strong> ${post.category?.name || "Genel"}</p>
            <p><strong>Etiketler:</strong> ${(post.tags || [])
              .map((t) => t.name)
              .join(", ")}</p>
            <p><strong>Yazar:</strong> ${
              post.user?.name || post.user?.username
            }</p>
          ]]>
        `,
        url: `https://materialblog.vercel.app/post/${post.slug}`,
        guid: post._id.toString(),
        author: post.user?.name || post.user?.username,
        date: post.createdAt || post.date,
        custom_elements: [
          {
            "media:content": [
              { _attr: { url: post.image || "", medium: "image" } },
            ],
          },
        ],
      });
    });

    const xml = feed.xml({ indent: true });
    res.type("application/xml");
    res.send(xml);
  } catch (err) {
    console.error("RSS feed oluşturulamadı:", err);
    res.status(500).send("RSS feed hatası");
  }
});

module.exports = router;
