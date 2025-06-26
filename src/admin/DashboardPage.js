import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, Avatar, useTheme } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import axios from "axios";

const DashboardPage = () => {
  const [postCount, setPostCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get(
        "https://materialblog-server-production.up.railway.app/api/posts?limit=1000"
      )
      .then((res) => {
        setPostCount(res.data.posts?.length || 0);
      })
      .catch((err) => {
        console.error("Yazılar alınamadı:", err);
        setPostCount(0);
      });

    axios
      .get(
        "https://materialblog-server-production.up.railway.app/api/categories"
      )
      .then((res) => {
        setCategoryCount(res.data.length);
      })
      .catch((err) => {
        console.error("Kategoriler alınamadı:", err);
        setCategoryCount(0);
      });

    axios
      .get("https://materialblog-server-production.up.railway.app/api/comments")
      .then((res) => {
        setCommentCount(res.data.length);
      })
      .catch((err) => {
        console.error("Yorumlar alınamadı:", err);
        setCommentCount(0);
      });
  }, []);

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

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Yazı"
            value={postCount}
            icon={<ArticleIcon />}
            iconColor={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Kategori"
            value={categoryCount}
            icon={<CategoryIcon />}
            iconColor={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Yorum"
            value={commentCount}
            icon={<CommentIcon />}
            iconColor={theme.palette.info.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
