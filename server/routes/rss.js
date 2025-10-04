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
      pubDate: new Date().toUTCString(),
      ttl: 60,
      custom_namespaces: {
        media: "http://search.yahoo.com/mrss/",
      },
    });

    const posts = await Post.find()
      .populate("user", "username name profileImage")
      .populate("category", "name slug color icon")
      .populate("tags", "name tagSlug")
      .sort({ date: -1 })
      .limit(20);

    posts.forEach((post) => {
      const plainDescription =
        post.summary ||
        (post.content
          ? post.content.replace(/<[^>]+>/g, "").substring(0, 200) + "..."
          : "");

      const htmlDescription = `
        <![CDATA[
          <p>${post.summary || plainDescription}</p>
          ${
            post.image
              ? `<img src="${post.image}" alt="${post.title}" width="600" style="border-radius:8px;"/>`
              : ""
          }
          <p><strong>Kategori:</strong> ${post.category?.name || "Genel"}</p>
          <p><strong>Etiketler:</strong> ${(post.tags || [])
            .map((t) => t.name)
            .join(", ")}</p>
          <p><strong>Yazar:</strong> ${
            post.user?.name || post.user?.username || "Material Blog"
          }</p>
        ]]>
      `;

      feed.item({
        title: post.title,
        description: htmlDescription,
        url: `https://materialblog.vercel.app/post/${post.slug}`,
        guid: post._id.toString(),
        author: post.user?.name || post.user?.username,
        date: new Date(post.createdAt || post.date).toUTCString(),
        custom_elements: post.image
          ? [
              {
                "media:content": [
                  {
                    _attr: {
                      url: post.image,
                      medium: "image",
                      type: "image/jpeg",
                    },
                  },
                ],
              },
            ]
          : [],
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
