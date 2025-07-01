import React, { useEffect } from "react";
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
import PostCard from "../components/PostCard";
import Sidebar from "../components/sidebar/Sidebar";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  setSearchTerm,
  setPage,
} from "../redux/searchSlice";

const POSTS_PER_PAGE = 6;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTermFromURL = searchParams.get("q")?.toLowerCase() || "";
  const pageFromURL = parseInt(searchParams.get("page")) || 1;

  const dispatch = useDispatch();
  const theme = useTheme();

  const { searchTerm, results, page, totalPages, loading } = useSelector(
    (state) => state.search
  );

  // İlk yüklemede URL'den gelen veriyi store'a yaz
  useEffect(() => {
    dispatch(setSearchTerm(searchTermFromURL));
    dispatch(setPage(pageFromURL));
  }, [dispatch, searchTermFromURL, pageFromURL]);

  // Arama sonuçlarını çek
  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchResults({ searchTerm, page, limit: POSTS_PER_PAGE }));
    }
  }, [dispatch, searchTerm, page]);

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
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
          ) : results.length === 0 ? (
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
                {results.map((post) => (
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
