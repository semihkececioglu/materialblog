import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, useTheme } from "@mui/material";
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

  const StatCard = ({ title, value, icon }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {icon}
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Yazı"
            value={postCount}
            icon={<ArticleIcon color="primary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Kategori"
            value={categoryCount}
            icon={<CategoryIcon color="secondary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Yorum"
            value={commentCount}
            icon={
              <CommentIcon
                sx={{ color: theme.palette.info.main }}
                fontSize="large"
              />
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
