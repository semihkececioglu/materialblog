import React, { useEffect, useMemo, useCallback, startTransition } from "react";
import {
  Box,
  Pagination,
  Container,
  useTheme,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";
import HomeSlider from "../components/HomeSlider";
import Sidebar from "../components/sidebar/Sidebar";
import PostCard from "../components/PostCard"; // Direkt import - lazy loading kaldırıldı

const POSTS_PER_PAGE = 6;

const Home = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const page = parseInt(pageNumber) || 1;

  const { posts, totalPages, loading, error } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchPosts({ page, limit: POSTS_PER_PAGE }));
    });
  }, [dispatch, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Memoized pagination handler
  const handleChange = useCallback(
    (event, value) => {
      startTransition(() => {
        navigate(value === 1 ? "/" : `/page/${value}`);
      });
    },
    [navigate]
  );

  // Memoized pagination styles
  const paginationStyles = useMemo(
    () => ({
      "& .MuiPaginationItem-root": {
        fontWeight: 600,
        borderRadius: "50%",
        width: 48,
        height: 48,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)",
        color: theme.palette.text.primary,
        border: "none",
        transition: "all 0.2s ease",
        "&.Mui-selected": {
          backgroundColor: "#000000",
          color: "white",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.12)",
        },
        "&.MuiPaginationItem-ellipsis": {
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    }),
    [theme.palette.mode, theme.palette.text.primary]
  );

  // Memoized styles
  const containerStyles = useMemo(() => ({ mt: 4 }), []);

  const mainBoxStyles = useMemo(
    () => ({
      display: "flex",
      gap: 4,
      flexDirection: { xs: "column", md: "row" },
    }),
    []
  );

  const contentBoxStyles = useMemo(() => ({ flex: 3 }), []);

  const sidebarBoxStyles = useMemo(
    () => ({
      flex: 1,
      minHeight: 800, // Minimum height to prevent collapse
    }),
    []
  );

  // POSTS GRID - Sabit yükseklik ile
  const postsGridStyles = useMemo(
    () => ({
      display: "flex",
      flexWrap: "wrap",
      gap: 3,
      minHeight: 800, // Sabit minimum yükseklik - layout shift önlenir
    }),
    []
  );

  const postItemStyles = useMemo(
    () => ({
      flex: "1 1 calc(33.333% - 20px)",
      minWidth: "250px",
      height: 360, // Sabit yükseklik - her item için
    }),
    []
  );

  // Content area için sabit container
  const contentAreaStyles = useMemo(
    () => ({
      minHeight: 900, // İçerik alanı için sabit minimum yükseklik
    }),
    []
  );

  return (
    <Container maxWidth="lg" sx={containerStyles}>
      {/* HomeSlider direkt render */}
      <HomeSlider />

      <Box sx={mainBoxStyles}>
        {/* Ana içerik - Sabit yükseklik container */}
        <Box sx={contentBoxStyles}>
          <Box sx={contentAreaStyles}>
            {/* Posts Grid - Her zaman aynı layout */}
            <Box sx={postsGridStyles}>
              {loading ? (
                // Loading state - Skeleton kartlar (direkt render)
                Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
                  <Box key={`loading-${i}`} sx={postItemStyles}>
                    <PostCard isLoading={true} priority={i < 3} index={i} />
                  </Box>
                ))
              ) : error ? (
                // Error state - Aynı grid yapısında
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    py: 8,
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" color="error">
                    Hata: {error}
                  </Typography>
                </Box>
              ) : posts.length === 0 ? (
                // Empty state - Aynı grid yapısında
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    py: 8,
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Henüz içerik bulunmuyor
                  </Typography>
                </Box>
              ) : (
                // Content loaded state (direkt render)
                posts.map((post, index) => (
                  <Box key={post._id} sx={postItemStyles}>
                    <PostCard
                      post={post}
                      priority={index < 3}
                      index={index}
                      isLoading={false}
                    />
                  </Box>
                ))
              )}
            </Box>

            {/* Pagination - Sabit pozisyon */}
            {!loading && !error && totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 6,
                  minHeight: 80, // Pagination için sabit alan
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChange}
                  size="large"
                  sx={paginationStyles}
                />
              </Box>
            )}

            {/* Loading state pagination placeholder */}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 6,
                  minHeight: 80, // Aynı yükseklik
                }}
              >
                {/* Pagination skeleton */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.08)",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Sidebar - Direkt render, lazy loading YOK */}
        <Box sx={sidebarBoxStyles}>
          <Sidebar />
        </Box>
      </Box>
    </Container>
  );
};

export default React.memo(Home);
