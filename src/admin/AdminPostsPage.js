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

const categoryColors = {
  React: "primary",
  JavaScript: "warning",
  Tasarım: "secondary",
  Galatasaray: "success",
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
    <Box sx={{ pt: 1 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Yazılar
        </Typography>

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
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">Tüm Kategoriler</MenuItem>
            {Object.keys(categoryColors).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="newest">En Yeni</MenuItem>
            <MenuItem value="oldest">En Eski</MenuItem>
            <MenuItem value="title-asc">Başlık A-Z</MenuItem>
            <MenuItem value="title-desc">Başlık Z-A</MenuItem>
          </TextField>

          {(user?.role === "admin" || user?.role === "editor") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/editor")}
              sx={{ borderRadius: 3 }}
            >
              Yeni Yazı
            </Button>
          )}
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Başlık</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tarih</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePosts.map((post) => (
                <TableRow key={post._id} hover>
                  <TableCell>{post._id.slice(-6)}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={post.category}
                      color={categoryColors[post.category] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {post.date && dayjs(post.date).isValid()
                      ? dayjs(post.date).format("DD.MM.YYYY")
                      : "Geçersiz"}
                  </TableCell>
                  <TableCell align="right">
                    {user?.role === "admin" && (
                      <>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(post)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setPostToDelete(post._id);
                            setConfirmDelete(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {totalPages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
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
