import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Pagination,
  CircularProgress,
} from "@mui/material";
import PageTransitionWrapper from "../components/common/PageTransitionWrapper";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";

const POSTS_PER_PAGE = 6;

function CategoryPage() {
  const { kategoriAdi, pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const page = parseInt(pageNumber) || 1;

  const { posts, totalPages, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(
      fetchPosts({
        category: decodeURIComponent(kategoriAdi),
        page,
        limit: POSTS_PER_PAGE,
      })
    );
  }, [dispatch, kategoriAdi, page]);

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

  const formattedCategoryName = decodeURIComponent(kategoriAdi)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <PageTransitionWrapper>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {formattedCategoryName} Kategorisi
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
    </PageTransitionWrapper>
  );
}

export default CategoryPage;
