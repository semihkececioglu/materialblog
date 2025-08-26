import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Pagination,
  Chip,
  useTheme,
  Paper,
} from "@mui/material";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";

const POSTS_PER_PAGE = 6;

const tagColors = {
  react: "#61dafb",
  javascript: "#f7df1e",
  css: "#2965f1",
  html: "#e34c26",
  blog: "#00b894",
  "material-ui": "#0081cb",
  seo: "#ff6d00",
};

const tagDescriptions = {
  react: "React ile ilgili en güncel yazılar, ipuçları ve rehberler burada.",
  javascript:
    "JavaScript dünyasına dair fonksiyonlar, async yapılar ve daha fazlası.",
  css: "Stil, düzen ve animasyonlar konusunda CSS ile ilgili içerikler.",
  html: "Semantik HTML, etiket kullanımı ve yapısal ipuçları.",
  blog: "Blog yönetimi, içerik üretimi ve yazarlık deneyimleri.",
  "material-ui": "Material UI ile arayüz tasarımı ve bileşen kullanımı.",
  seo: "Arama motoru optimizasyonu ve SEO teknikleri.",
};

function TagPosts() {
  const { tag, pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const page = parseInt(pageNumber) || 1;

  const { posts, totalPages, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(
      fetchPosts({
        tag: decodeURIComponent(tag),
        page,
        limit: POSTS_PER_PAGE,
      })
    );
  }, [dispatch, tag, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (event, value) => {
    const url = value === 1 ? `/tag/${tag}` : `/tag/${tag}/page/${value}`;
    navigate(url);
  };

  const tagKey = decodeURIComponent(tag).toLowerCase();
  const tagLabel = tagKey
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const chipColor = tagColors[tagKey] || theme.palette.primary.main;
  const description =
    tagDescriptions[tagKey] || "Bu etikete ait açıklama henüz eklenmedi.";

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Etiket Bilgi Kutusu */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
          backdropFilter: "blur(8px)",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Etiket:
          </Typography>
          <Chip
            label={`#${tagLabel}`}
            sx={{
              bgcolor: chipColor,
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          {description}
        </Typography>

        <Typography variant="caption" color="text.disabled">
          Toplam {posts.length} yazı bulundu.
        </Typography>
      </Paper>

      {/* İçerik */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "grey.900"
                : theme.palette.grey[50],
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[300]
            }`,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Bu etikete ait yazı bulunamadı!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aradığınız etiket henüz herhangi bir yazıya eklenmemiş olabilir.
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
            {posts.map((post) => (
              <Box
                key={post._id}
                sx={{
                  flex: "1 1 calc(33.333% - 20px)",
                  minWidth: "250px",
                }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default TagPosts;
