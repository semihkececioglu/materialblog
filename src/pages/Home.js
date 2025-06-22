import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  useTheme,
  Container,
} from "@mui/material";
import PostCard from "../components/PostCard";
import Sidebar from "../components/sidebar/Sidebar";
import initialPosts from "../data";
import axios from "axios";

const POSTS_PER_PAGE = 6;

const Home = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("https://materialblog-server-production.up.railway.app/api/posts")
      .then((res) => {
        setAllPosts(res.data);
      })
      .catch((err) => {
        console.error("Yazılar alınamadı:", err);
      });
  }, []);

  const paginatedPosts = allPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const handleChange = (event, value) => {
    setPage(value);
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
        {/* Ana içerik */}
        <Box sx={{ flex: 3 }}>
          <Typography variant="h4" gutterBottom>
            Blog Yazıları
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {paginatedPosts.map((post) => (
              <Box
                key={post._id}
                sx={{ flex: "1 1 calc(33.333% - 20px)", minWidth: "250px" }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>

          {allPosts.length > POSTS_PER_PAGE && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(allPosts.length / POSTS_PER_PAGE)}
                page={page}
                onChange={handleChange}
                color="primary"
              />
            </Box>
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
