import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Fade,
  Grow,
  useTheme,
  Chip,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchTerm } from "../redux/searchSlice";

const SearchDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  // Popüler arama terimleri
  const popularSearches = [
    "React",
    "JavaScript",
    "CSS",
    "Node.js",
    "Python",
    "UI/UX",
    "Tasarım",
    "Frontend",
    "Backend",
    "API",
  ];

  // Component mount olduğunda localStorage'dan recent searches'i al
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
      setLocalSearchTerm("");
    }
  }, [open]);

  const handleSearch = (term = localSearchTerm) => {
    const searchQuery = term.trim();
    if (searchQuery) {
      // Recent searches'e ekle
      const updatedRecent = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));

      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      dispatch(setSearchTerm(searchQuery));
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        onClick: onClose,
      }}
    >
      <Fade in={open} timeout={300}>
        <Paper
          onClick={(e) => e.stopPropagation()}
          elevation={0}
          sx={{
            width: "90%",
            maxWidth: 600,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(30,30,30,0.95), rgba(20,20,20,0.98))"
                : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,250,0.98))",
            backdropFilter: "blur(30px)",
            borderRadius: 4,
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.08)",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              pb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
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
              <Typography variant="h6" fontWeight={600}>
                Arama
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: theme.palette.error.main + "20",
                  color: theme.palette.error.main,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search Input */}
          <Box sx={{ px: 3, pb: 2 }}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                borderRadius: 3,
                border: "2px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:focus-within": {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
                },
              }}
            >
              <SearchIcon
                sx={{
                  ml: 2,
                  color: "text.secondary",
                  fontSize: 20,
                }}
              />
              <input
                autoFocus
                placeholder="Ne aramak istiyorsun?"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%",
                  padding: "16px 12px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1.1rem",
                  fontFamily: theme.typography.fontFamily,
                  color: theme.palette.text.primary,
                  textAlign: "left",
                }}
              />
              {localSearchTerm && (
                <IconButton
                  onClick={() => setLocalSearchTerm("")}
                  sx={{ mr: 1 }}
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Grow in timeout={400}>
              <Box sx={{ px: 3, pb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HistoryIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Son Aramalar
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={clearRecentSearches}
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      "&:hover": {
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {recentSearches.map((search, index) => (
                    <Chip
                      key={index}
                      label={search}
                      onClick={() => handleSearch(search)}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main + "20",
                          color: theme.palette.primary.main,
                          transform: "translateY(-1px)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grow>
          )}

          {/* Popular Searches */}
          <Grow in timeout={600}>
            <Box sx={{ px: 3, pb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <TrendingIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Popüler Aramalar
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {popularSearches.map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    onClick={() => handleSearch(search)}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      borderColor: theme.palette.primary.main + "40",
                      color: theme.palette.primary.main,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        borderColor: theme.palette.primary.main,
                        transform: "translateY(-1px)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grow>

          {/* Keyboard Shortcuts */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
              borderTop: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "text.secondary",
                  }}
                >
                  Enter
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Ara
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "text.secondary",
                  }}
                >
                  Esc
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Kapat
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Dialog>
  );
};

export default SearchDialog;
