import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Pagination,
  CircularProgress,
  Paper,
} from "@mui/material";
import PageTransitionWrapper from "../components/common/PageTransitionWrapper";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";

const POSTS_PER_PAGE = 6;

function CategoryPage() {
  const { kategoriAdi, pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const page = parseInt(pageNumber) || 1;

  const { posts, totalPages, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(
      fetchPosts({
        category: decodeURIComponent(kategoriAdi),
        page,
        limit: POSTS_PER_PAGE,
      })
    );
  }, [dispatch, kategoriAdi, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (event, value) => {
    const pageUrl =
      value === 1
        ? `/category/${kategoriAdi}`
        : `/category/${kategoriAdi}/page/${value}`;
    navigate(pageUrl);
  };

  const formattedCategoryName = decodeURIComponent(kategoriAdi)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const getCategoryDescription = (slug) => {
    const descriptions = {
      react:
        "React, bileşen tabanlı kullanıcı arayüzleri geliştirmek için kullanılan popüler bir JavaScript kütüphanesidir.",
      javascript:
        "JavaScript, web’in dinamik doğasını mümkün kılan güçlü bir programlama dilidir.",
      tasarim:
        "Tasarım kategorisi; UI/UX, renk teorisi ve kullanıcı odaklı arayüz geliştirme üzerine içerikler sunar.",
      oyun: "Bu kategoride oyun geliştirme, Unity, Godot ve oyun tasarımıyla ilgili yazılar yer alır.",
      yazilim:
        "Yazılım geliştirme süreçleri, temiz kod prensipleri ve proje mimarilerine dair yazılar burada bulunur.",
    };

    const key = decodeURIComponent(slug).toLowerCase();
    return descriptions[key] || "Bu kategoriye ait açıklama henüz eklenmedi.";
  };

  return (
    <PageTransitionWrapper>
      <Container sx={{ mt: 4 }}>
        {/* Kategori Bilgi Kutusu */}
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {formattedCategoryName} Kategorisi
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {getCategoryDescription(kategoriAdi)}
          </Typography>

          <Typography variant="caption" color="text.disabled">
            Toplam {posts.length} yazı bulundu.
          </Typography>
        </Paper>

        {/* Yükleniyor */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Yazılar Listesi */}
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

            {/* Sayfalama */}
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
    </PageTransitionWrapper>
  );
}

export default CategoryPage;
