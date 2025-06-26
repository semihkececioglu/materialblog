import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Pagination,
  CircularProgress,
} from "@mui/material";

const POSTS_PER_PAGE = 6;

function CategoryPage() {
  const { kategoriAdi, pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const page = parseInt(pageNumber) || 1;
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/posts?category=${kategoriAdi}&page=${page}&limit=${POSTS_PER_PAGE}`
        );
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Kategoriye göre postlar alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCategory();
  }, [kategoriAdi, page]);

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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {decodeURIComponent(kategoriAdi)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
        Kategorisi
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
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

export default CategoryPage;
