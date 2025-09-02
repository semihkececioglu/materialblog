import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Pagination,
  Container,
  Skeleton,
  Paper,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PostCard from "../components/PostCard";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  setSearchTerm,
  setPage,
} from "../redux/searchSlice";

const POSTS_PER_PAGE = 6;

const SearchSkeletonCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        height: 350,
        flex: "1 1 30%",
        minWidth: 220,
        maxWidth: 370,
        border: "1px solid",
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={180}
        sx={{ borderRadius: 2, mb: 2 }}
      />
      <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Skeleton variant="rounded" width={60} height={20} />
        <Skeleton variant="rounded" width={80} height={20} />
      </Box>
      <Skeleton variant="text" height={16} width="60%" />
    </Paper>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTermFromURL = searchParams.get("q")?.toLowerCase() || "";
  const pageFromURL = parseInt(searchParams.get("page")) || 1;

  const dispatch = useDispatch();
  const theme = useTheme();

  const { searchTerm, results, page, totalPages, loading } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    dispatch(setSearchTerm(searchTermFromURL));
    dispatch(setPage(pageFromURL));
  }, [dispatch, searchTermFromURL, pageFromURL]);

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchResults({ searchTerm, page, limit: POSTS_PER_PAGE }));
    }
  }, [dispatch, searchTerm, page]);

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
    setSearchParams({ q: searchTerm, page: value });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchTerm, page]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
              : "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <SearchIcon />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Arama Sonuçları
            </Typography>
            <Typography variant="body1" color="text.secondary">
              "{searchTerm}" için bulunan sonuçlar
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <SearchSkeletonCard key={item} />
          ))}
        </Box>
      ) : results.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.01)",
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: "text.secondary",
              mb: 2,
              opacity: 0.6,
            }}
          />
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            Sonuç bulunamadı
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            "{searchTerm}" arama teriminiz için hiçbir yazı bulunamadı.
          </Typography>
          <Alert
            severity="info"
            sx={{
              maxWidth: 500,
              mx: "auto",
              borderRadius: 3,
              textAlign: "left",
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
          >
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              <strong>Öneriler:</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Farklı kelimeler deneyebilirsiniz
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Yazım hatası olup olmadığını kontrol edin
              </Typography>
              <Typography component="li" variant="body2">
                Daha genel terimler kullanmayı deneyin
              </Typography>
            </Box>
          </Alert>
        </Paper>
      ) : (
        <Box>
          {/* Posts Grid */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 5 }}>
            {results.map((post) => (
              <Box
                key={post._id}
                sx={{
                  flex: "1 1 30%",
                  minWidth: 220,
                  maxWidth: 370,
                }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>

          {/* Modern Black Rounded Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 600,
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                    color: theme.palette.text.primary,
                    border: "none",
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                      backgroundColor: "#000000",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                    },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(0,0,0,0.12)",
                    },
                    "&.MuiPaginationItem-ellipsis": {
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;
