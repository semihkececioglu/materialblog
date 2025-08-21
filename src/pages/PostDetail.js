import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  Chip,
  useTheme,
  Paper,
  Button,
  Avatar,
  alpha,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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

/* ---------- Görsel yardımcıları (KESKİN PROFİL) ---------- */
const isCloudinary = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes("/image/upload/");

/** Temel dönüştürücü: keskin profil (q_auto:best + dpr_auto) */
const cld = (url, params) =>
  url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto:best,dpr_auto,${params}/`
  );

/** srcset üretici (c_fit ile sığdır, upscaleye izin ver) */
const buildSrcSet = (url, widths) =>
  widths.map((w) => `${cld(url, `c_fit,w_${w}`)} ${w}w`).join(", ");

/** HERO (kapak) kaynakları — kadrajı doldur, kompozisyonu koru, hafif netleştir */
const buildHeroSources = (url) => {
  if (!isCloudinary(url)) {
    return { src: url, srcSet: undefined, sizes: undefined };
  }
  return {
    src: cld(url, "c_fill,g_auto,w_1600,e_sharpen"),
    srcSet: [
      `${cld(url, "c_fill,g_auto,w_1000,e_sharpen")} 1000w`,
      `${cld(url, "c_fill,g_auto,w_1400,e_sharpen")} 1400w`,
      `${cld(url, "c_fill,g_auto,w_1600,e_sharpen")} 1600w`,
      `${cld(url, "c_fill,g_auto,w_2000,e_sharpen")} 2000w`,
    ].join(", "),
    sizes: "(max-width: 900px) 100vw, 900px",
  };
};

/** İçerik HTML içindeki <img> etiketlerini optimize et (src+srcset+lazy/async) */
const optimizeHtmlImages = (html) => {
  if (!html) return "";
  return html.replace(
    /<img([^>]*?)\s+src=["']([^"']+)["']([^>]*)>/gi,
    (full, pre, src, post) => {
      let newSrc = src;
      let extra = "";

      if (isCloudinary(src)) {
        // İçerikte oranı koru, upscaleye izin ver; hafif netleştir.
        newSrc = cld(src, "c_fit,w_1600,e_sharpen");

        const hasSrcSet = /\ssrcset=/.test(full);
        const hasSizes = /\ssizes=/.test(full);
        if (!hasSrcSet) {
          const srcSet = buildSrcSet(src, [800, 1200, 1600, 2000]);
          extra += ` srcset="${srcSet}"`;
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
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            {/* Hero Section with Overlay Content */}
            <Box sx={{ position: "relative" }}>
              {/* Background Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: "300px", sm: "400px", md: "500px" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
                  },
                }}
              >
                {hero ? (
                  <img
                    src={hero.src}
                    srcSet={hero.srcSet}
                    sizes={hero.sizes}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                    }}
                  />
                )}
              </Box>

              {/* Overlay Content */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: { xs: 2, sm: 3, md: 4 },
                  color: "white",
                }}
              >
                {/* Category */}
                <Chip
                  label={post.category || "Genel"}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: alpha("#fff", 0.2),
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.3),
                    },
                  }}
                />

                {/* Title */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {post.title}
                </Typography>

                {/* Author Info */}
                <Box
                  sx={{
                    display: "inline-flex", // Changed from flex to inline-flex
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha("#000", 0.3),
                    backdropFilter: "blur(10px)",
                    maxWidth: "100%", // Ensure it doesn't overflow on mobile
                  }}
                >
                  <Avatar
                    component={Link}
                    to={`/profile/${author.username}`}
                    src={author.profileImage}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid",
                      borderColor: "white",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {author.username[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    {" "}
                    {/* Remove flex: 1 */}
                    <Typography
                      component={Link}
                      to={`/profile/${author.username}`}
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "white",
                        textDecoration: "none",
                        display: "block",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {author.name || author.username}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        icon={
                          <CalendarTodayIcon
                            sx={{
                              fontSize: "1rem !important",
                              color: "inherit !important",
                            }}
                          />
                        }
                        label={formattedDate}
                        size="small"
                        sx={{
                          height: 24,
                          bgcolor: alpha("#fff", 0.1),
                          color: "white",
                          fontSize: "0.75rem",
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                      <Chip
                        icon={
                          <AccessTimeIcon
                            sx={{
                              fontSize: "1rem !important",
                              color: "inherit !important",
                            }}
                          />
                        }
                        label={`${readingTime} dk`}
                        size="small"
                        sx={{
                          height: 24,
                          bgcolor: alpha("#fff", 0.1),
                          color: "white",
                          fontSize: "0.75rem",
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <TableOfContents />
              <Box
                sx={{
                  typography: "body1",
                  lineHeight: 1.8,
                  color: "text.primary",
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 2,
                    my: 3,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: optimizedHtml }}
              />

              {/* Tags Section */}
              {post.tags?.length > 0 && (
                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {post.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`#${tag}`}
                        component={Link}
                        to={`/tag/${tag}`}
                        clickable
                        sx={{
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.08),
                          color: "primary.main",
                          border: "none",
                          textTransform: "lowercase",
                          fontWeight: 500,
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <EmbeddedInteractionBar
                visible={showEmbeddedBar}
                postId={post._id}
              />
            </Box>
          </Paper>

          {/* Enhanced Prev/Next Navigation */}
          <Box
            sx={{
              mt: 6,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {prevPost && (
              <Paper
                component={Link}
                to={`/post/${slugify(prevPost.title)}`}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: "divider",
                  textDecoration: "none",
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateX(-4px)",
                    "& .arrow-icon": {
                      transform: "translateX(-4px)",
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ArrowBackIosNewIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 20,
                    transition: "all 0.2s ease",
                    color: "text.secondary",
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Önceki Yazı
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.3,
                    }}
                  >
                    {prevPost.title}
                  </Typography>
                </Box>
              </Paper>
            )}

            {nextPost && (
              <Paper
                component={Link}
                to={`/post/${slugify(nextPost.title)}`}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: "divider",
                  textDecoration: "none",
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateX(4px)",
                    "& .arrow-icon": {
                      transform: "translateX(4px)",
                      color: "primary.main",
                    },
                  },
                }}
              >
                <Box sx={{ flex: 1, textAlign: "right" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Sonraki Yazı
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.3,
                    }}
                  >
                    {nextPost.title}
                  </Typography>
                </Box>
                <ArrowForwardIosIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 20,
                    transition: "all 0.2s ease",
                    color: "text.secondary",
                  }}
                />
              </Paper>
            )}
          </Box>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <Box id="recommendations" sx={{ mt: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: "primary.main",
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  >
                    Benzer Yazılar
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {relatedPosts.map((related) => (
                    <PostCard key={related._id} post={related} />
                  ))}
                </Box>
              </Paper>
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
