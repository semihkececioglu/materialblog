import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import GAStatsPanel from "./GAStatsPanel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
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

  // StatCard bileşenini güncelleyelim
  const StatCard = ({ title, value, icon, iconColor }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flex: 1,
        minWidth: 240,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        sx={{
          bgcolor: "transparent",
          color: iconColor,
          width: 45,
          height: 45,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h5" fontSize="1.5rem" fontWeight="600">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  if (loadingStats || !stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Veriler alınamadı: {error}
      </Typography>
    );
  }

  // Import kısmının altına dummy data ekleyelim
  const dummyPopularPosts = [
    {
      _id: "1",
      title: "React Hooks Kullanım Rehberi",
      viewCount: 1250,
      slug: "react-hooks",
    },
    {
      _id: "2",
      title: "Material UI ile Modern Tasarımlar",
      viewCount: 980,
      slug: "material-ui",
    },
    {
      _id: "3",
      title: "Redux Toolkit Best Practices",
      viewCount: 854,
      slug: "redux-toolkit",
    },
    {
      _id: "4",
      title: "Next.js SSR ve SSG Karşılaştırması",
      viewCount: 743,
      slug: "nextjs-ssr-ssg",
    },
    {
      _id: "5",
      title: "TypeScript ile Güvenli Kodlama",
      viewCount: 621,
      slug: "typescript",
    },
  ];

  // Return kısmını güncelleyin
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Stat Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <StatCard
          title="Toplam Yazı"
          value={stats.totalPosts}
          icon={<ArticleIcon />}
          iconColor={theme.palette.primary.main}
        />
        <StatCard
          title="Toplam Kategori"
          value={stats.totalCategories}
          icon={<CategoryIcon />}
          iconColor={theme.palette.secondary.main}
        />
        <StatCard
          title="Toplam Yorum"
          value={stats.totalComments}
          icon={<CommentIcon />}
          iconColor={theme.palette.info.main}
        />
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers || "0"} // API'den gelen değeri kullanın
          icon={<PersonIcon />}
          iconColor={theme.palette.success.main}
        />
      </Box>

      {/* Content Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", lg: "row" },
          width: "100%",
          "& > *": {
            // Tüm child Paper'lar için ortak stiller
            flex: "1 1 0",
            p: 3,
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: "divider",
            minHeight: 480, // Sabit yükseklik
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Son Yazılar */}
        <Paper>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              pb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            SON YAZILAR
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
              flex: 1,
            }}
          >
            {latestPosts.slice(0, 5).map((post) => (
              <Box
                key={post._id}
                onClick={() => navigate(`/post/${post.slug}`)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: "translateX(6px)",
                  },
                }}
              >
                <Avatar
                  variant="rounded"
                  src={post.image}
                  sx={{ width: 52, height: 52 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="500">
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Son Yorumlar */}
        <Paper>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              pb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            SON YORUMLAR
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {latestComments.slice(0, 5).map((comment) => (
              <Box
                key={comment._id}
                onClick={() => navigate(`/post/${comment.postId?.slug}`)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                  },
                  p: 1,
                  borderRadius: 1.5,
                }}
              >
                <Avatar
                  src={comment.user?.profileImage}
                  sx={{ width: 40, height: 40 }}
                >
                  {comment.user?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {comment.user?.username || "Anonim"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                  >
                    {comment.text.length > 60
                      ? comment.text.slice(0, 60) + "..."
                      : comment.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.disabled", mt: 0.5 }}
                  >
                    {new Date(comment.date).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Popüler Yazılar */}
        <Paper>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              pb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            POPÜLER YAZILAR
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {dummyPopularPosts.map((post, index) => (
              <Box
                key={post._id}
                onClick={() => navigate(`/post/${post.slug}`)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: "translateX(6px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {index + 1}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.viewCount.toLocaleString()} görüntülenme
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* GA Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.9)",
        }}
      >
        <GAStatsPanel />
      </Paper>
    </Box>
  );
};

export default AdminDashboardPage;
