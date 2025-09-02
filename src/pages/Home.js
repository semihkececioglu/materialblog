import React, { useEffect } from "react";
import { Box, Pagination, Container, useTheme } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PostCard from "../components/PostCard";
import Sidebar from "../components/sidebar/Sidebar";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import HomeSlider from "../components/HomeSlider";
import { fetchPosts } from "../redux/postSlice";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";

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
    dispatch(fetchPosts({ page, limit: POSTS_PER_PAGE }));
  }, [dispatch, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleChange = (event, value) => {
    navigate(value === 1 ? "/" : `/page/${value}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Slider - kendi içinde loading skeleton'u var */}
      <HomeSlider />

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Ana içerik */}
        <Box sx={{ flex: 3 }}>
          {loading ? (
            <>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: "1 1 calc(33.333% - 20px)",
                      minWidth: "250px",
                    }}
                  >
                    <PostCardSkeleton />
                  </Box>
                ))}
              </Box>
              {/* Sayfalama yer tutucu */}
              <Box sx={{ mt: 4, height: 40 }} />
            </>
          ) : error ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <p>Hata: {error}</p>
            </Box>
          ) : (
            <>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
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
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                    size="large"
                    sx={{
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
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 1 }}>
          {loading ? <SidebarSkeleton /> : <Sidebar />}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
