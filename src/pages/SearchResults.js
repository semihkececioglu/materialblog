// SearchResults.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Pagination,
  Grow,
  Container,
} from "@mui/material";
import posts from "../data";
import PostCard from "../components/PostCard";
import Sidebar from "../components/sidebar/Sidebar";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const POSTS_PER_PAGE = 6;

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q")?.toLowerCase() || "";
  const theme = useTheme();
  const [page, setPage] = useState(1);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

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

          {filteredPosts.length === 0 ? (
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
                {displayedPosts.map((post) => (
                  <Grow in key={post.id} timeout={500}>
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
                    onChange={(e, value) => setPage(value)}
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
