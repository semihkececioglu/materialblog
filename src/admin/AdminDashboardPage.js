import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../redux/dashboardSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
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
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Yazı"
            value={stats.totalPosts}
            icon={<ArticleIcon />}
            iconColor={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Kategori"
            value={stats.totalCategories}
            icon={<CategoryIcon />}
            iconColor={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Yorum"
            value={stats.totalComments}
            icon={<CommentIcon />}
            iconColor={theme.palette.info.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
