import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  IconButton,
  Collapse,
  useMediaQuery,
  Box,
  Chip,
  alpha,
} from "@mui/material";
import {
  MenuBook as MenuBookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Article as ArticleIcon,
  KeyboardArrowRight as ArrowIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const TableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(false); // Başlangıçta kapalı
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  useEffect(() => {
    // Daha spesifik post içeriği alanını bul
    const postContentSelectors = [
      ".post-content h2, .post-content h3",
      ".content h2, .content h3",
      ".article-content h2, .article-content h3",
      ".blog-content h2, .blog-content h3",
      '[data-testid="post-content"] h2, [data-testid="post-content"] h3',
      "article h2, article h3",
      ".post-body h2, .post-body h3",
      ".entry-content h2, .entry-content h3",
      // Daha spesifik selectors
      ".post-detail .content h2, .post-detail .content h3",
      ".blog-post .content h2, .blog-post .content h3",
      "main .content h2, main .content h3",
      // Material Blog spesifik
      '[class*="content"] h2, [class*="content"] h3',
      '[class*="post"] [class*="content"] h2, [class*="post"] [class*="content"] h3',
    ];

    let elements = [];

    // Sırayla selector'ları dene
    for (const selector of postContentSelectors) {
      elements = Array.from(document.querySelectorAll(selector));
      if (elements.length > 0) break;
    }

    // Eğer özel selector ile bulunamazsa, daha akıllı filtreleme yap
    if (elements.length === 0) {
      const allHeadings = Array.from(document.querySelectorAll("h2, h3"));

      // Başlık metinlerine göre filtrele (kategori, tag, sosyal medya vb. alanları hariç tut)
      const excludeTexts = [
        "kategori",
        "kategoriler",
        "category",
        "categories",
        "etiket",
        "etiketler",
        "tag",
        "tags",
        "sosyal medya",
        "social media",
        "paylaş",
        "share",
        "yorumlar",
        "comments",
        "yorum yap",
        "leave a comment",
        "ilgili yazılar",
        "related posts",
        "related articles",
        "benzer yazılar",
        "similar posts",
        "öne çıkan",
        "featured",
        "popüler",
        "popular",
        "son yazılar",
        "recent posts",
        "latest posts",
        "arşiv",
        "archive",
        "sidebar",
        "widget",
      ];

      elements = allHeadings.filter((el) => {
        // Parent kontrolü - header, nav, footer, aside, sidebar, postcard vb. alanları hariç tut
        const excludeParents = el.closest(`
          header, nav, footer, aside, 
          .header, .navbar, .footer, .sidebar, .menu, .widget, .archive, 
          .categories, .tags, .social, .related, .comments-section,
          .post-card, .postcard, [class*="card"], [class*="Card"],
          .similar-posts, .related-posts, .recommended-posts,
          .sidebar-widget, .widget-area
        `);
        if (excludeParents) return false;

        // Başlık metni kontrolü
        const text = el.textContent.toLowerCase().trim();
        const isExcluded = excludeTexts.some((excludeText) =>
          text.includes(excludeText.toLowerCase())
        );
        if (isExcluded) return false;

        // Ana içerik alanında olup olmadığını kontrol et
        const isInMainContent = el.closest(
          'main, .main-content, .post-detail, .blog-post, article, .article, .post, [class*="content"]'
        );
        if (!isInMainContent) return false;

        // PostCard içinde olup olmadığını kontrol et
        const isInPostCard = el.closest(
          '.post-card, .postcard, [class*="card"], [class*="Card"], .similar-posts, .related-posts'
        );
        if (isInPostCard) return false;

        // En az 3 karakter uzunluğunda olsun
        if (text.length < 3) return false;

        return true;
      });
    }

    // Eğer hala başlık bulunamadıysa, sadece main content area içindeki başlıkları al
    if (elements.length === 0) {
      const mainContentAreas = document.querySelectorAll(
        "main, .main-content, .post-detail, .blog-post, article"
      );
      for (const area of mainContentAreas) {
        const headingsInArea = Array.from(area.querySelectorAll("h2, h3"));
        if (headingsInArea.length > 0) {
          elements = headingsInArea.filter((el) => {
            const text = el.textContent.toLowerCase().trim();

            // PostCard kontrolü
            const isInPostCard = el.closest(
              '.post-card, .postcard, [class*="card"], [class*="Card"], .similar-posts, .related-posts, .recommended-posts'
            );
            if (isInPostCard) return false;

            return (
              text.length > 3 &&
              !text.includes("kategori") &&
              !text.includes("etiket") &&
              !text.includes("sosyal") &&
              !text.includes("paylaş") &&
              !text.includes("yorum") &&
              !text.includes("benzer") &&
              !text.includes("ilgili") &&
              !text.includes("related") &&
              !text.includes("similar")
            );
          });
          if (elements.length > 0) break;
        }
      }
    }

    const newHeadings = elements
      .map((el, index) => {
        // ID oluştur (eğer yoksa)
        let id = el.id;
        if (!id) {
          id = `heading-${index}-${el.textContent
            .replace(/\s+/g, "-")
            .toLowerCase()
            .replace(/[^\w\-]/g, "")}`;
          el.id = id;
        }

        return {
          id,
          text: el.textContent.trim(),
          level: el.tagName,
          offsetTop: el.offsetTop,
          element: el,
        };
      })
      .filter((heading) => {
        // Çift filtreleme - başlık metni kontrolü
        const text = heading.text.toLowerCase();
        return (
          heading.text.length > 0 &&
          !text.includes("kategori") &&
          !text.includes("etiket") &&
          !text.includes("sosyal medya") &&
          !text.includes("paylaş") &&
          !text.includes("yorum") &&
          !text.includes("benzer yazılar") &&
          !text.includes("ilgili yazılar") &&
          !text.includes("related posts") &&
          !text.includes("similar posts") &&
          !text.includes("recommended") &&
          !text.includes("önerilen")
        );
      });

    setHeadings(newHeadings);
    setActiveId(null);
    setOpen(false); // Yeni sayfa yüklendiğinde kapalı
  }, [location.pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let current = null;

      // Güncel offsetTop değerlerini al (dinamik içerik için)
      const updatedHeadings = headings.map((heading) => ({
        ...heading,
        offsetTop: heading.element
          ? heading.element.offsetTop
          : heading.offsetTop,
      }));

      for (let i = 0; i < updatedHeadings.length; i++) {
        if (updatedHeadings[i].offsetTop <= scrollPosition) {
          current = updatedHeadings[i].id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    // İlk yüklemede bir kez çalıştır
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const elementPosition = el.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const groupedHeadings = headings.reduce((acc, heading) => {
    if (heading.level === "H2") {
      acc.push({ ...heading, children: [] });
    } else if (heading.level === "H3" && acc.length > 0) {
      acc[acc.length - 1].children.push(heading);
    }
    return acc;
  }, []);

  // Başlık yoksa componenti render etme
  if (!headings.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: { xs: 2, md: 3 },
          borderRadius: 3,
          overflow: "hidden",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.04)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Box
          onClick={() => setOpen(!open)}
          sx={{
            p: { xs: 2, md: 2.5 },
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))"
                : "linear-gradient(135deg, rgba(0,0,0,0.01), rgba(0,0,0,0.005))",
            borderBottom: open ? "1px solid" : "none",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              <MenuBookIcon
                sx={{
                  color: "white",
                  fontSize: { xs: 18, md: 20 },
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "text.primary",
                }}
              >
                İçindekiler
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 0.5,
                }}
              >
                <Chip
                  size="small"
                  label={`${headings.length} başlık`}
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    border: "none",
                  }}
                />
                {activeId && (
                  <Chip
                    size="small"
                    icon={<ArticleIcon sx={{ fontSize: "12px !important" }} />}
                    label="Okuyorsun"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: "success.main",
                      border: "none",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton
            size="small"
            sx={{
              width: { xs: 32, md: 36 },
              height: { xs: 32, md: 36 },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              },
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
          </IconButton>
        </Box>

        {/* Content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                opacity: { duration: 0.2 },
              }}
              style={{ overflow: "hidden" }}
            >
              <Box sx={{ p: { xs: 1, md: 1.5 } }}>
                <List
                  dense
                  sx={{
                    py: 0,
                    "& .MuiListItemButton-root": {
                      borderRadius: 2,
                      mb: 0.5,
                      transition: "all 0.2s ease",
                    },
                  }}
                >
                  {groupedHeadings.map((heading, index) => (
                    <Box key={heading.id}>
                      {/* H2 Başlık */}
                      <ListItemButton
                        selected={activeId === heading.id}
                        onClick={() => handleClick(heading.id)}
                        sx={{
                          py: { xs: 1, md: 1.2 },
                          px: { xs: 1.5, md: 2 },
                          borderRadius: 2,
                          "&.Mui-selected": {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            borderLeft: `3px solid ${theme.palette.primary.main}`,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.16),
                            },
                          },
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor:
                                activeId === heading.id
                                  ? "primary.main"
                                  : alpha(theme.palette.text.secondary, 0.1),
                              color:
                                activeId === heading.id
                                  ? "white"
                                  : "text.secondary",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                            }}
                          >
                            {index + 1}
                          </Box>
                          <ListItemText
                            primary={heading.text}
                            primaryTypographyProps={{
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              fontWeight: activeId === heading.id ? 600 : 500,
                              color:
                                activeId === heading.id
                                  ? "primary.main"
                                  : "text.primary",
                              lineHeight: 1.4,
                            }}
                          />
                        </Box>
                        {activeId === heading.id && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowIcon
                              sx={{
                                color: "primary.main",
                                fontSize: 16,
                              }}
                            />
                          </motion.div>
                        )}
                      </ListItemButton>

                      {/* H3 Alt Başlıklar */}
                      {heading.children.map((child, childIndex) => (
                        <ListItemButton
                          key={child.id}
                          selected={activeId === child.id}
                          onClick={() => handleClick(child.id)}
                          sx={{
                            py: { xs: 0.8, md: 1 },
                            px: { xs: 1.5, md: 2 },
                            pl: { xs: 4, md: 5 },
                            borderRadius: 2,
                            "&.Mui-selected": {
                              bgcolor: alpha(
                                theme.palette.secondary.main,
                                0.12
                              ),
                              borderLeft: `2px solid ${theme.palette.secondary.main}`,
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.secondary.main,
                                  0.16
                                ),
                              },
                            },
                            "&:hover": {
                              bgcolor: alpha(
                                theme.palette.secondary.main,
                                0.06
                              ),
                              transform: "translateX(4px)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor:
                                  activeId === child.id
                                    ? "secondary.main"
                                    : alpha(theme.palette.text.secondary, 0.08),
                                color:
                                  activeId === child.id
                                    ? "white"
                                    : "text.secondary",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                transition: "all 0.2s ease",
                              }}
                            >
                              {childIndex + 1}
                            </Box>
                            <ListItemText
                              primary={child.text}
                              primaryTypographyProps={{
                                fontSize: { xs: "0.8rem", md: "0.85rem" },
                                fontWeight: activeId === child.id ? 600 : 400,
                                color:
                                  activeId === child.id
                                    ? "secondary.main"
                                    : "text.secondary",
                                lineHeight: 1.3,
                              }}
                            />
                          </Box>
                          {activeId === child.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowIcon
                                sx={{
                                  color: "secondary.main",
                                  fontSize: 14,
                                }}
                              />
                            </motion.div>
                          )}
                        </ListItemButton>
                      ))}
                    </Box>
                  ))}
                </List>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
};

export default TableOfContents;
