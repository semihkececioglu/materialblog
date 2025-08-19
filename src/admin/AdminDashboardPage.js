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
import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchLatestComments,
  fetchLatestPosts,
} from "../redux/dashboardSlice";
import GAStatsPanel from "./GAStatsPanel";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const { stats, latestComments, latestPosts, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchLatestComments());
    dispatch(fetchLatestPosts());
  }, [dispatch]);

  const StatCard = ({ title, value, icon, iconColor }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Avatar
        sx={{
          bgcolor: iconColor || "primary.main",
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  if (loading || !stats) {
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Üst Satır: Stat Kartlar + Son Yazılar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {/* Sol: Stat Kartlar */}
        <Box
          sx={{
            flex: { xs: "100%", md: "66.66%" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
        </Box>

        {/* Sağ: Son Yazılar */}
        <Box
          sx={{
            flex: { xs: "100%", md: "33.33%" },
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            SON YAZILAR
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "background.paper",
              boxShadow: 2,
            }}
          >
            {latestPosts.map((post) => (
              <Box
                key={post._id}
                onClick={() => navigate(`/post/${post.slug}`)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                  },
                  px: 1,
                  py: 1,
                  borderRadius: 1.5,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={post.image}
                  sx={{ width: 56, height: 40 }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(post.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>

      {/* Alt Satır: Son Yorumlar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          gap: 3,
        }}
      >
        <Box
          sx={{
            flex: { xs: "100%", md: "33.33%" },
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            SON YORUMLAR
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "background.paper",
              boxShadow: 2,
            }}
          >
            {latestComments.map((comment) => (
              <Box
                key={comment._id}
                onClick={() => navigate(`/post/${comment.postId?.slug}`)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                  },
                  px: 1,
                  py: 1,
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
                    {new Date(comment.date).toLocaleString()} •{" "}
                    {comment.postId?.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>

      {/* GA Panel (tam genişlik) */}
      <GAStatsPanel />
    </Box>
  );
};

export default AdminDashboardPage;
