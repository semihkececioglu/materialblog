import React, { useEffect } from "react";
import {
  Box,
  Pagination,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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

  // ✅ Mobil / tablet / desktop için skeleton sayısını ayarlıyoruz
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const skeletonCount = isMobile ? 2 : isTablet ? 4 : POSTS_PER_PAGE;

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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr", // mobil tek sütun
                    sm: "1fr 1fr", // tablet 2 sütun
                    md: "1fr 1fr 1fr", // desktop 3 sütun
                  },
                  gap: 3,
                }}
              >
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <PostCardSkeleton key={i} />
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 3,
                }}
              >
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                    color="primary"
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
