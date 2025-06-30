import React, { useEffect } from "react";
import {
  Box,
  Pagination,
  useTheme,
  Container,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PostCard from "../components/PostCard";
import Sidebar from "../components/sidebar/Sidebar";
import HomeSlider from "../components/HomeSlider";
import { fetchPosts } from "../redux/postSlice";

const POSTS_PER_PAGE = 6;

const Home = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

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
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
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
          <Sidebar />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
