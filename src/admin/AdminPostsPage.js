import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../redux/postSlice";
import dayjs from "dayjs";
import { alpha } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TuneIcon from "@mui/icons-material/Tune";

const categoryColors = {
  React: {
    light: "#E3F2FD",
    main: "#2196F3",
    text: "#1976D2",
  },
  JavaScript: {
    light: "#FFF3E0",
    main: "#FF9800",
    text: "#F57C00",
  },
  Tasarım: {
    light: "#FCE4EC",
    main: "#E91E63",
    text: "#C2185B",
  },
  Galatasaray: {
    light: "#F3E5F5",
    main: "#9C27B0",
    text: "#7B1FA2",
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { posts: allPosts } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user.currentUser);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "newest"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const postsPerPage = 10;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (sortOption) params.sort = sortOption;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortOption, currentPage]);

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePost(postToDelete)).unwrap();
      dispatch(fetchPosts({ page: 1, limit: 1000 }));
      showSnackbar("Yazı silindi", "info");
    } catch {
      showSnackbar("Silme başarısız", "error");
    } finally {
      setConfirmDelete(false);
      setPostToDelete(null);
    }
  };

  const showSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleEdit = (post) => navigate(`/admin/posts/edit/${post._id}`);

  // 🔎 Arama ve filtreleme işlemleri
  const filtered = useMemo(() => {
    let filtered = [...allPosts];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (sortOption === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "title-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    }

    return filtered;
  }, [allPosts, searchTerm, selectedCategory, sortOption]);

  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const visiblePosts = filtered.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1920, mx: "auto" }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Title and New Post Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Yazılar
            </Typography>
            <Chip
              label={`${filtered.length} yazı`}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: 500,
                height: "24px",
              }}
            />
          </Box>

          {(user?.role === "admin" || user?.role === "editor") && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/editor")}
              sx={{
                borderRadius: "8px",
                px: 2,
                py: 0.75,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Yeni Yazı
            </Button>
          )}
        </Box>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Yazılarda ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              maxWidth: { sm: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                "&:hover": {
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.8),
                },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
              alignItems: "center",
            }}
          >
            <TuneIcon sx={{ color: "text.secondary" }} />

            <TextField
              select
              size="small"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.6),
                },
              }}
            >
              <MenuItem value="">Tüm Kategoriler</MenuItem>
              {Object.entries(categoryColors).map(([cat, colors]) => (
                <MenuItem key={cat} value={cat}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: colors.main,
                      }}
                    />
                    <Typography>{cat}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.6),
                },
              }}
            >
              <MenuItem value="newest">En Yeni</MenuItem>
              <MenuItem value="oldest">En Eski</MenuItem>
              <MenuItem value="title-asc">Başlık A-Z</MenuItem>
              <MenuItem value="title-desc">Başlık Z-A</MenuItem>
            </TextField>
          </Box>
        </Box>
      </Paper>

      {/* Posts Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  Başlık
                </TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  Kategori
                </TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  Tarih
                </TableCell>
                <TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePosts.map((post) => (
                <TableRow
                  key={post._id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                    },
                  }}
                >
                  <TableCell sx={{ py: 2, px: 3 }}>
                    <Typography
                      variant="mono"
                      sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                    >
                      {post._id.slice(-6)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 3 }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {post.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 3 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        bgcolor: categoryColors[post.category]?.light,
                        color: categoryColors[post.category]?.text,
                        fontWeight: 500,
                        px: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 3, color: "text.secondary" }}>
                    {post.date && dayjs(post.date).isValid()
                      ? dayjs(post.date).format("DD.MM.YYYY")
                      : "Geçersiz"}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2, px: 3 }}>
                    {user?.role === "admin" && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(post)}
                          sx={{
                            color: "primary.main",
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.1),
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setPostToDelete(post._id);
                            setConfirmDelete(true);
                          }}
                          sx={{
                            color: "error.main",
                            bgcolor: (theme) =>
                              alpha(theme.palette.error.main, 0.1),
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.error.main, 0.2),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "12px",
                "&.Mui-selected": {
                  fontWeight: 600,
                },
              },
            }}
          />
        </Box>
      )}

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Bu yazıyı silmek istiyor musunuz?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>İptal</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostsPage;
