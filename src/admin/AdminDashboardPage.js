import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  IconButton,
  alpha,
  Skeleton,
  Badge,
  Divider,
  Tooltip,
  Button,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";
import GAStatsPanel from "./GAStatsPanel";
// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchLatestComments,
  fetchLatestPosts,
} from "../redux/dashboardSlice";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const { stats, latestComments, latestPosts, loadingStats, error } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchLatestComments());
    dispatch(fetchLatestPosts());
  }, [dispatch]);

  // Enhanced Loading skeleton for content cards
  const ContentCardSkeleton = () => (
    <Card
      elevation={0}
      sx={{
        height: 520,
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(145deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )}, ${alpha(theme.palette.background.default, 0.8)})`
            : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                "#f8fafc",
                0.95
              )})`,
        backdropFilter: "blur(20px)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="text" width={140} height={32} />
            <Skeleton variant="circular" width={36} height={36} />
          </Stack>
        </Box>
        <Box sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            {[...Array(5)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  p: 1.5,
                }}
              >
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="70%" height={16} />
                  <Skeleton variant="text" width="40%" height={14} />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Format date function
  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Bugün";
    if (diffDays === 2) return "Dün";
    if (diffDays <= 7) return `${diffDays} gün önce`;
    return postDate.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
  };

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8, p: 6 }}>
        <Box
          sx={{
            maxWidth: 400,
            mx: "auto",
            p: 4,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          }}
        >
          <Typography variant="h5" color="error" fontWeight={700} gutterBottom>
            Bir Hata Oluştu
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Veriler alınamadı: {error}
          </Typography>
          <IconButton
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: "error.main",
              "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.2) },
            }}
          >
            <TrendingUpIcon />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      {/* Enhanced Header Section */}
      <Box
        sx={{
          mb: 6,
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.8
                )}, ${alpha(theme.palette.background.default, 0.95)})`
              : `linear-gradient(135deg, ${alpha("#f8fafc", 0.95)}, ${alpha(
                  "#fff",
                  0.98
                )})`,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backdropFilter: "blur(20px)",
          p: 4,
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 20%, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, transparent 50%), 
                       radial-gradient(circle at 80% 80%, ${alpha(
                         theme.palette.secondary.main,
                         0.06
                       )} 0%, transparent 50%)`,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              {/* Animated Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: -2,
                    borderRadius: "inherit",
                    padding: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    WebkitMaskComposite: "xor",
                    opacity: 0.3,
                  },
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 28, color: "white" }} />
              </Box>

              {/* Title Section */}
              <Box>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  sx={{
                    mb: 1,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    letterSpacing: "-2px",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Dashboard
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{
                    opacity: 0.8,
                    fontSize: "1.1rem",
                    maxWidth: 500,
                  }}
                >
                  Blog istatistiklerinizi ve son aktiviteleri görüntüleyin
                </Typography>
              </Box>
            </Stack>

            {/* Quick Actions - Sadece Yenile Butonu */}
            <Stack direction="row" spacing={1.5}>
              <Tooltip title="Yenile">
                <IconButton
                  onClick={() => {
                    dispatch(fetchDashboardStats());
                    dispatch(fetchLatestComments());
                    dispatch(fetchLatestPosts());
                  }}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    width: 44,
                    height: 44,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      transform: "rotate(180deg) scale(1.1)",
                    },
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Stats Summary Bar - Toplam Kategori Eklendi */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flex: 1 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: "primary.main",
                }}
              >
                <ArticleIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ lineHeight: 1 }}
                >
                  {stats?.totalPosts || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Toplam Yazı
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flex: 1 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha(theme.palette.secondary.main, 0.15),
                  color: "secondary.main",
                }}
              >
                <CategoryIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ lineHeight: 1 }}
                >
                  {stats?.totalCategories || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Toplam Kategori
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flex: 1 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha(theme.palette.info.main, 0.15),
                  color: "info.main",
                }}
              >
                <CommentIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ lineHeight: 1 }}
                >
                  {stats?.totalComments || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Toplam Yorum
                </Typography>
              </Box>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: 1,
                display: { xs: "none", sm: "block" },
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                alignSelf: "center",
                fontSize: "0.85rem",
              }}
            >
              Son güncelleme:{" "}
              {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Modern Two Column Layout */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {/* Son Yazılar - Modern Card */}
        <Grid item xs={12} lg={6}>
          {loadingStats ? (
            <ContentCardSkeleton />
          ) : (
            <Card
              elevation={0}
              sx={{
                height: 520,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(145deg, ${alpha(
                        theme.palette.background.paper,
                        0.95
                      )}, ${alpha(theme.palette.background.default, 0.8)})`
                    : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                        "#f8fafc",
                        0.95
                      )})`,
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )}`,
                },
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.08
                  )}`,
                  background: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <ArticleIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Son Yazılar
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        En son yayınlanan içerikler
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/admin/posts")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "0.8rem",
                      px: 2,
                      py: 0.5,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    Tümünü Gör
                  </Button>
                </Stack>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  p: 2,
                  height: "calc(100% - 100px)",
                  overflow: "auto",
                  // Custom scrollbar styles matching theme.js
                  scrollbarWidth: "thin",
                  scrollbarColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1) transparent"
                      : "rgba(0,0,0,0.1) transparent",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    backdropFilter: "blur(6px)",
                    transition: "all 0.3s ease",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundImage:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
                        : "linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))",
                  },
                }}
              >
                {latestPosts?.length > 0 ? (
                  <Stack spacing={1}>
                    {latestPosts.slice(0, 5).map((post, index) => (
                      <Paper
                        key={post._id}
                        onClick={() => navigate(`/post/${post.slug}`)}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          cursor: "pointer",
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.06
                          )}`,
                          background: "transparent",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            transform: "translateX(4px)",
                            boxShadow: `0 4px 20px ${alpha(
                              theme.palette.primary.main,
                              0.1
                            )}`,
                            "& .post-actions": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                        >
                          {/* Post Image/Icon */}
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              variant="rounded"
                              src={post.image}
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                border: `2px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.1
                                )}`,
                              }}
                            >
                              <ArticleIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                height: 20,
                                minWidth: 20,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                "& .MuiChip-label": { px: 0.5 },
                              }}
                            />
                          </Box>

                          {/* Post Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              sx={{
                                mb: 0.5,
                                color: "text.primary",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.3,
                              }}
                            >
                              {post.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.4,
                                fontSize: "0.85rem",
                              }}
                            >
                              {truncateText(
                                post.content ||
                                  post.excerpt ||
                                  "İçerik önizlemesi bulunmuyor...",
                                120
                              )}
                            </Typography>

                            {/* Post Meta */}
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                              >
                                <AccessTimeIcon
                                  sx={{ fontSize: 14, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontSize="0.75rem"
                                >
                                  {formatDate(post.date || post.createdAt)}
                                </Typography>
                              </Stack>

                              {post.category && (
                                <>
                                  <FiberManualRecordIcon
                                    sx={{
                                      fontSize: 4,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.5}
                                  >
                                    <FolderIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontSize="0.75rem"
                                    >
                                      {post.category.name || post.category}
                                    </Typography>
                                  </Stack>
                                </>
                              )}
                            </Stack>
                          </Box>

                          {/* Quick Actions */}
                          <Box
                            className="post-actions"
                            sx={{
                              opacity: 0,
                              transform: "translateX(10px)",
                              transition: "all 0.3s ease",
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Tooltip title="Düzenle" placement="left">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/posts/edit/${post._id}`);
                                }}
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  color: "primary.main",
                                  width: 28,
                                  height: 28,
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Görüntüle" placement="left">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/post/${post.slug}`, "_blank");
                                }}
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: "info.main",
                                  width: 28,
                                  height: 28,
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.info.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <VisibilityIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <ArticleIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      fontWeight={500}
                      sx={{ mb: 1 }}
                    >
                      Henüz yazı bulunmuyor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      İlk yazınızı oluşturmak için "Yeni Yazı" butonuna tıklayın
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          )}
        </Grid>

        {/* Son Yorumlar - Modern Card */}
        <Grid item xs={12} lg={6}>
          {loadingStats ? (
            <ContentCardSkeleton />
          ) : (
            <Card
              elevation={0}
              sx={{
                height: 520,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(145deg, ${alpha(
                        theme.palette.background.paper,
                        0.95
                      )}, ${alpha(theme.palette.background.default, 0.8)})`
                    : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                        "#f8fafc",
                        0.95
                      )})`,
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.info.main,
                    0.12
                  )}`,
                },
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.08
                  )}`,
                  background: alpha(theme.palette.info.main, 0.02),
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: "info.main",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <CommentIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Son Yorumlar
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        En son gelen kullanıcı yorumları
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/admin/comments")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "0.8rem",
                      px: 2,
                      py: 0.5,
                      borderColor: alpha(theme.palette.info.main, 0.3),
                      color: "info.main",
                      "&:hover": {
                        borderColor: "info.main",
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                      },
                    }}
                  >
                    Tümünü Gör
                  </Button>
                </Stack>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  p: 2,
                  height: "calc(100% - 100px)",
                  overflow: "auto",
                  // Custom scrollbar styles matching theme.js
                  scrollbarWidth: "thin",
                  scrollbarColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1) transparent"
                      : "rgba(0,0,0,0.1) transparent",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    backdropFilter: "blur(6px)",
                    transition: "all 0.3s ease",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundImage:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
                        : "linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))",
                  },
                }}
              >
                {latestComments?.length > 0 ? (
                  <Stack spacing={1}>
                    {latestComments.slice(0, 5).map((comment, index) => (
                      <Paper
                        key={comment._id}
                        onClick={() =>
                          navigate(`/post/${comment.postId?.slug}`)
                        }
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          cursor: "pointer",
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.06
                          )}`,
                          background: "transparent",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.info.main, 0.03),
                            borderColor: alpha(theme.palette.info.main, 0.2),
                            transform: "translateX(4px)",
                            boxShadow: `0 4px 20px ${alpha(
                              theme.palette.info.main,
                              0.1
                            )}`,
                            "& .comment-actions": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                        >
                          {/* User Avatar */}
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              src={comment.user?.profileImage}
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: "info.main",
                                fontSize: "1rem",
                                fontWeight: 600,
                                border: `2px solid ${alpha(
                                  theme.palette.info.main,
                                  0.1
                                )}`,
                              }}
                            >
                              {comment.user?.username?.[0]?.toUpperCase() ||
                                comment.user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                height: 20,
                                minWidth: 20,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                bgcolor: theme.palette.info.main,
                                color: "white",
                                "& .MuiChip-label": { px: 0.5 },
                              }}
                            />
                          </Box>

                          {/* Comment Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{ mb: 0.5 }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="text.primary"
                              >
                                {comment.user?.username ||
                                  comment.user?.name ||
                                  "Anonim"}
                              </Typography>
                              <FiberManualRecordIcon
                                sx={{ fontSize: 4, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontSize="0.75rem"
                              >
                                {formatDate(comment.date || comment.createdAt)}
                              </Typography>
                            </Stack>

                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                mb: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.4,
                                fontWeight: 500,
                                pl: 1,
                                borderLeft: `3px solid ${alpha(
                                  theme.palette.info.main,
                                  0.2
                                )}`,
                              }}
                            >
                              "{comment.text || comment.content}"
                            </Typography>

                            {comment.postId?.title && (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                              >
                                <ChatBubbleIcon
                                  sx={{ fontSize: 14, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: "0.75rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {truncateText(comment.postId.title, 50)}
                                </Typography>
                              </Stack>
                            )}
                          </Box>

                          {/* Quick Actions */}
                          <Box
                            className="comment-actions"
                            sx={{
                              opacity: 0,
                              transform: "translateX(10px)",
                              transition: "all 0.3s ease",
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Tooltip title="Yanıtla" placement="left">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/post/${comment.postId?.slug}#comment-${comment._id}`
                                  );
                                }}
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: "info.main",
                                  width: 28,
                                  height: 28,
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.info.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <ReplyIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Yazıyı Görüntüle" placement="left">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `/post/${comment.postId?.slug}`,
                                    "_blank"
                                  );
                                }}
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.success.main,
                                    0.1
                                  ),
                                  color: "success.main",
                                  width: 28,
                                  height: 28,
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.success.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <VisibilityIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: "info.main",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <CommentIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      fontWeight={500}
                      sx={{ mb: 1 }}
                    >
                      Henüz yorum bulunmuyor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Yazılarınıza gelen yorumlar burada görünecek
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Enhanced GA Panel */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(145deg, ${alpha(
                  theme.palette.background.paper,
                  0.95
                )}, ${alpha(theme.palette.background.default, 0.8)})`
              : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                  "#f8fafc",
                  0.95
                )})`,
          backdropFilter: "blur(20px)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <GAStatsPanel />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboardPage;
