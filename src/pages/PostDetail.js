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

import CommentSection from "../components/comment/CommentSection";
import Sidebar from "../components/sidebar/Sidebar";
import AuthorInfo from "../components/postDetail/AuthorInfo";
import PostCard from "../components/PostCard";
import FloatingInteractionBar from "../components/postDetail/interactionBar/FloatingInteractionBar";
import EmbeddedInteractionBar from "../components/postDetail/interactionBar/EmbeddedInteractionBar";
import ScrollProgressBar from "../components/postDetail/ScrollProgressBar";
import TableOfContents from "../components/postDetail/TableOfContents";
import slugify from "../utils/slugify";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import PostDetailSkeleton from "../components/skeletons/PostDetailSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostBySlug,
  clearSelectedPost,
  fetchPosts,
} from "../redux/postSlice";
import {
  fetchInteractionData,
  resetInteraction,
} from "../redux/interactionSlice";

/* ---------- Görsel yardımcıları (güncel) ---------- */
const isCloudinary = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes("/image/upload/");

/** Cloudinary param ekleyici (q_auto:good + dpr_auto default) */
const cld = (url, params) =>
  url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto:good,dpr_auto,${params}/`
  );

/** srcset üretici */
const buildSrcSet = (url, widths = [800, 1200, 1600, 2000]) =>
  widths.map((w) => `${cld(url, `c_limit,w_${w}`)} ${w}w`).join(", ");

/** Kapak görseli kaynakları */
const buildHeroSources = (url) => {
  if (!isCloudinary(url)) {
    return { src: url, srcSet: undefined, sizes: undefined };
  }
  return {
    src: cld(url, "c_limit,w_1600"),
    srcSet: buildSrcSet(url, [800, 1200, 1600, 2000]),
    sizes: "(max-width: 900px) 100vw, 900px",
  };
};

// İçerik HTML içindeki resimleri optimize et (src + srcset + lazy)
const optimizeHtmlImages = (html) => {
  if (!html) return "";
  return html.replace(
    /<img([^>]*?)\s+src=["']([^"']+)["']([^>]*)>/gi,
    (full, pre, src, post) => {
      let newSrc = src;
      let extra = "";

      if (isCloudinary(src)) {
        // Ana kaynak (1600w) + srcset/sizes
        newSrc = cld(src, "c_limit,w_1600");
        const hasSrcSet = /\ssrcset=/.test(full);
        const hasSizes = /\ssizes=/.test(full);
        if (!hasSrcSet) {
          extra += ` srcset="${buildSrcSet(src, [800, 1200, 1600, 2000])}"`;
        }
        if (!hasSizes) {
          extra += ` sizes="(max-width: 900px) 100vw, 900px"`;
        }
      }

      const hasLoading = /\sloading=/.test(full);
      const hasDecoding = /\sdecoding=/.test(full);

      return `<img${pre} src="${newSrc}"${hasLoading ? "" : ' loading="lazy"'}${
        hasDecoding ? "" : ' decoding="async"'
      }${extra}${post}>`;
    }
  );
};

function PostDetail() {
  const { slug } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const post = useSelector((state) => state.posts.selectedPost);
  const loading = useSelector((state) => state.posts.loading);
  const allPosts = useSelector((state) => state.posts.posts);

  const [showEmbeddedBar, setShowEmbeddedBar] = useState(false);

  useEffect(() => {
    dispatch(fetchPostBySlug(slug));
    dispatch(fetchPosts({ page: 1, limit: 1000 }));
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    if (post?._id) {
      dispatch(fetchInteractionData({ postId: post._id, userId: user?._id }));
    } else {
      dispatch(resetInteraction());
    }
  }, [post?._id, user?._id, dispatch]);

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <PostDetailSkeleton />
          <Box sx={{ flex: 1 }}>
            <SidebarSkeleton />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container sx={{ mt: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[300]
            }`,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Yazı bulunamadı!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aradığınız yazı yayından kaldırılmış veya bağlantı hatalı olabilir.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readingTime = Math.ceil(post.content.split(" ").length / 150);
  const author = post.user || {
    name: "Bilinmeyen",
    username: "anonymous",
    profileImage: "",
  };
  const currentIndex = allPosts.findIndex((p) => p._id === post._id);
  const prevPost = allPosts[currentIndex - 1];
  const nextPost = allPosts[currentIndex + 1];
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p._id !== post._id)
    .slice(0, 3);

  const hero = post.image ? buildHeroSources(post.image) : null;
  const optimizedHtml = optimizeHtmlImages(post.content);

  return (
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
              name={author.name || author.username}
              avatar={author.profileImage}
              username={author.username}
              date={formattedDate}
              readingTime={readingTime}
            />

            {hero && (
              <Box
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  aspectRatio: "1200/630",
                  maxHeight: 430,
                  "& img": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                }}
              >
                <img
                  src={hero.src}
                  srcSet={hero.srcSet}
                  sizes={hero.sizes}
                  alt={post.title}
                  width={1200}
                  height={630}
                  fetchpriority="high"
                  decoding="async"
                />
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
                  height: "auto",
                  borderRadius: 2,
                  my: 2,
                  boxShadow: 3,
                },
              }}
              dangerouslySetInnerHTML={{ __html: optimizedHtml }}
            />

            <EmbeddedInteractionBar
              visible={showEmbeddedBar}
              postId={post._id}
            />

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

          {/* Prev/Next */}
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": { bgcolor: "primary.light", color: "white" },
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
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": { bgcolor: "primary.light", color: "white" },
                }}
              >
                {nextPost.title}
                <ArrowForwardIosIcon fontSize="small" />
              </Box>
            )}
          </Box>

          {/* Related */}
          {relatedPosts.length > 0 && (
            <Box id="recommendations" sx={{ mt: 6 }}>
              <Typography variant="h6" gutterBottom>
                Benzer Yazılar
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {relatedPosts.map((related) => (
                  <Box
                    key={related._id}
                    sx={{ flex: "1 1 calc(33.333% - 20px)", minWidth: "250px" }}
                  >
                    <PostCard post={related} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 6 }} id="comment-form">
            <CommentSection postId={post._id} />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Sidebar />
        </Box>
      </Box>

      <FloatingInteractionBar visible={!showEmbeddedBar} postId={post._id} />
    </Container>
  );
}

export default PostDetail;
