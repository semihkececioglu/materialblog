import React, { useEffect, useState } from "react";
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
import axios from "axios";
import PostCard from "../components/PostCard";

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

function TagPosts() {
  const { tag, pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const page = parseInt(pageNumber) || 1;

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaggedPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/posts?tag=${tag}&page=${page}&limit=${POSTS_PER_PAGE}`
        );
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Etikete göre yazılar alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaggedPosts();
  }, [tag, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (event, value) => {
    const url = value === 1 ? `/tag/${tag}` : `/tag/${tag}/page/${value}`;
    navigate(url);
  };

  const tagLabel = tag
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Etiket:{" "}
        <Chip
          label={`#${tagLabel}`}
          sx={{
            bgcolor: tagColors[tag.toLowerCase()] || theme.palette.primary.main,
            color: "white",
          }}
        />
      </Typography>

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
