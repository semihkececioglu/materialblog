import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  useTheme,
  Pagination,
} from "@mui/material";
import initialPosts from "../data";
import PostCard from "../components/PostCard";

const tagColors = {
  react: "#61dafb",
  javascript: "#f7df1e",
  css: "#2965f1",
  html: "#e34c26",
  blog: "#00b894",
  "material-ui": "#0081cb",
  seo: "#ff6d00",
};

const POSTS_PER_PAGE = 6;

const TagPosts = () => {
  const { tag } = useParams();
  const theme = useTheme();
  const [page, setPage] = useState(1);

  const stored = JSON.parse(localStorage.getItem("posts")) || [];
  const allPosts = [
    ...stored,
    ...initialPosts.filter((p) => !stored.some((s) => s.id === p.id)),
  ];

  const filteredPosts = allPosts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );

  const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Etiket:{" "}
        <Chip
          label={`#${tag}`}
          sx={{
            bgcolor: tagColors[tag] || theme.palette.primary.main,
            color: "white",
          }}
        />
      </Typography>

      {filteredPosts.length === 0 ? (
        <Typography variant="body1">
          Bu etikete ait henüz bir yazı yok.
        </Typography>
      ) : (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
            {paginatedPosts.map((post) => (
              <Box
                key={post.id}
                sx={{
                  flex: "1 1 calc(33.333% - 20px)",
                  minWidth: "250px",
                }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={pageCount}
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
};

export default TagPosts;
