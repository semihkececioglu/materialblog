import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  Chip,
  useTheme,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";

import CommentSection from "../components/CommentSection";
import Sidebar from "../components/sidebar/Sidebar";
import AuthorInfo from "../components/AuthorInfo";
import PostCard from "../components/PostCard";
import FloatingInteractionBar from "../components/FloatingInteractionBar";
import EmbeddedInteractionBar from "../components/EmbeddedInteractionBar";
import { InteractionBarProvider } from "../contexts/InteractionBarContext";
import ScrollProgressBar from "../components/ScrollProgressBar";
import TableOfContents from "../components/TableOfContents";
import slugify from "../utils/slugify";

function PostDetail() {
  const { slug } = useParams();
  const theme = useTheme();
  const [showEmbeddedBar, setShowEmbeddedBar] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get("https://materialblog-server-production.up.railway.app//api/posts")
      .then((res) => {
        setAllPosts(res.data);
        const found = res.data.find((p) => slugify(p.title) === slug);
        setPost(found);
      })
      .catch((err) => {
        console.error("Yazı verisi alınamadı:", err);
      });
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const postPaper = document.getElementById("post-paper");
      if (!postPaper) return;
      const scrollBottom = window.scrollY + window.innerHeight;
      const paperBottom = postPaper.offsetTop + postPaper.offsetHeight;
      setShowEmbeddedBar(scrollBottom >= paperBottom - 50);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!post) return <div>Yazı bulunamadı!</div>;

  const formattedDate = new Date(post.date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const readingTime = Math.ceil(post.content.split(" ").length / 150);
  const author = {
    name: "Semih Rahman Keçecioğlu",
    avatar:
      "https://ui-avatars.com/api/?name=Semih+R&background=0D8ABC&color=fff",
  };

  const currentIndex = allPosts.findIndex((p) => p._id === post._id);
  const prevPost = allPosts[currentIndex - 1];
  const nextPost = allPosts[currentIndex + 1];

  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p._id !== post._id)
    .slice(0, 3);

  return (
    <InteractionBarProvider postId={post._id}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <ScrollProgressBar />

          <Box sx={{ flex: 3 }}>
            <Paper
              id="post-paper"
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]
                }`,
              }}
            >
              <Chip
                label={post.category || "Genel"}
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="h4" gutterBottom>
                {post.title}
              </Typography>

              <AuthorInfo
                name={author.name}
                avatar={author.avatar}
                date={formattedDate}
                readingTime={readingTime}
              />

              {/* ✅ Kapak görseli */}
              {post.image && (
                <Box
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    maxHeight: 400,
                    "& img": {
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: 2,
                      boxShadow: 3,
                    },
                  }}
                >
                  <img src={post.image} alt={post.title} />
                </Box>
              )}

              <TableOfContents />

              <Box
                sx={{
                  mt: 3,
                  lineHeight: 1.8,
                  color: theme.palette.text.primary,
                  "& img": {
                    maxWidth: "100%",
                    borderRadius: 2,
                    my: 2,
                    boxShadow: 3,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <EmbeddedInteractionBar visible={showEmbeddedBar} />

              {post.tags?.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      component="a"
                      href={`/tag/${tag}`}
                      clickable
                      color="default"
                      variant="outlined"
                      sx={{
                        textTransform: "lowercase",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          color: "white",
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>

            {/* Önceki / Sonraki Yazılar */}
            <Box
              sx={{
                mt: 6,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {prevPost && (
                <Box
                  component={Link}
                  to={`/post/${slugify(prevPost.title)}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "action.hover",
                    p: 2,
                    borderRadius: 2,
                    flex: "1 1 45%",
                    transition: "0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                    },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                  {prevPost.title}
                </Box>
              )}
              {nextPost && (
                <Box
                  component={Link}
                  to={`/post/${slugify(nextPost.title)}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "action.hover",
                    p: 2,
                    borderRadius: 2,
                    flex: "1 1 45%",
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1,
                    transition: "0.2s",
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                    },
                  }}
                >
                  {nextPost.title}
                  <ArrowForwardIosIcon fontSize="small" />
                </Box>
              )}
            </Box>

            {/* Benzer yazılar */}
            {relatedPosts.length > 0 && (
              <Box id="recommendations" sx={{ mt: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Benzer Yazılar
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {relatedPosts.map((related) => (
                    <Box
                      key={related._id}
                      sx={{
                        flex: "1 1 calc(33.333% - 20px)",
                        minWidth: "250px",
                      }}
                    >
                      <PostCard post={related} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Yorumlar */}
            <Box sx={{ mt: 6 }} id="comment-form">
              <CommentSection postId={post._id} />
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Sidebar />
          </Box>
        </Box>

        <FloatingInteractionBar visible={!showEmbeddedBar} />
      </Container>
    </InteractionBarProvider>
  );
}

export default PostDetail;
