import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Pagination,
} from "@mui/material";

const POSTS_PER_PAGE = 6;

function CategoryPage() {
  const { kategoriAdi } = useParams(); // bu slug, örn: teknoloji
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        const res = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/posts?category=${kategoriAdi}`
        );
        setFilteredPosts(res.data);
      } catch (err) {
        console.error("Kategoriye göre postlar alınamadı:", err);
      }
    };

    fetchPostsByCategory();
  }, [kategoriAdi]);

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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {kategoriAdi.toUpperCase()} Kategorisi
      </Typography>

      {filteredPosts.length > 0 ? (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
            {paginatedPosts.map((post) => (
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
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Bu kategoriye ait yazı bulunamadı.
        </Typography>
      )}
    </Container>
  );
}

export default CategoryPage;
