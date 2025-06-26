import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Pagination,
  Grow,
  Container,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import PostCard from "../components/PostCard";
import Sidebar from "../components/sidebar/Sidebar";

const POSTS_PER_PAGE = 6;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q")?.toLowerCase() || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/posts?search=${searchTerm}&page=${page}&limit=${POSTS_PER_PAGE}`
        );
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Arama sonuçları alınamadı:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, page]);

  const handlePageChange = (event, value) => {
    setSearchParams({ q: searchTerm, page: value });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: 3 }}>
          <Typography variant="h5" gutterBottom>
            "{searchTerm}" için sonuçlar
          </Typography>

          {loading ? (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : posts.length === 0 ? (
            <Grow in>
              <Box
                sx={{
                  mt: 4,
                  p: 4,
                  textAlign: "center",
                  bgcolor:
                    theme.palette.mode === "dark" ? "grey.900" : "grey.100",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Üzgünüz, hiçbir sonuç bulunamadı.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Farklı bir anahtar kelime deneyebilirsiniz.
                </Typography>
              </Box>
            </Grow>
          ) : (
            <Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {posts.map((post) => (
                  <Grow in key={post._id} timeout={500}>
                    <Box
                      sx={{
                        flex: "1 1 30%",
                        minWidth: 220,
                        maxWidth: 370,
                      }}
                    >
                      <PostCard post={post} />
                    </Box>
                  </Grow>
                ))}
              </Box>
              {totalPages > 1 && (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Sidebar />
        </Box>
      </Box>
    </Container>
  );
};

export default SearchResults;
