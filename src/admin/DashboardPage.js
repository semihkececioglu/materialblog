import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import { styled } from "@mui/material/styles";

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  color: "#fff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: theme.shadows[6],
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[12],
  },
}));

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Dummy stats (ileride backend'den dinamik alınabilir)
  const stats = [
    {
      title: "Toplam Yazı",
      value: JSON.parse(localStorage.getItem("posts") || "[]").length,
      icon: <ArticleIcon fontSize="large" />,
      bg: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
    },
    {
      title: "Kategoriler",
      value: 3, // manuel/dummy
      icon: <CategoryIcon fontSize="large" />,
      bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    {
      title: "Yorumlar",
      value: 26, // dummy
      icon: <CommentIcon fontSize="large" />,
      bg: "linear-gradient(135deg, #fc6076 0%, #ff9a44 100%)",
    },
  ];

  return (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <StatCard sx={{ background: stat.bg }}>
              <Box display="flex" alignItems="center" gap={2}>
                {stat.icon}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
