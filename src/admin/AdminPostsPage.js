import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../redux/postSlice";
import dayjs from "dayjs"; // Tarih formatlama

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
  const [sortField, setSortField] = useState(
    searchParams.get("sortField") || ""
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "asc"
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
    if (sortField) params.sortField = sortField;
    if (sortOrder !== "asc") params.sortOrder = sortOrder;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortField, sortOrder, currentPage]);

  const showSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePost(postToDelete)).unwrap();
      dispatch(fetchPosts({ page: 1, limit: 1000 }));
      showSnackbar("Yazı silindi", "info");
    } catch (err) {
      showSnackbar("Silme başarısız", "error");
    } finally {
      setConfirmDelete(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteRequest = (id) => {
    setPostToDelete(id);
    setConfirmDelete(true);
  };

  const handleEdit = (post) => navigate(`/admin/posts/edit/${post._id}`);

  let filtered = [...allPosts].filter((post) => {
    const searchMatch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory
      ? post.category === selectedCategory
      : true;
    return searchMatch && categoryMatch;
  });

  if (sortField) {
    filtered.sort((a, b) => {
      const valA =
        sortField === "createdAt"
          ? new Date(a[sortField])
          : a[sortField]?.toLowerCase?.();
      const valB =
        sortField === "createdAt"
          ? new Date(b[sortField])
          : b[sortField]?.toLowerCase?.();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

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
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Yazılar
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            background: "rgba(255,255,255,0.25)",
            borderRadius: 3,
            px: 2,
            py: 1.5,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          }}
        >
          <TextField
            size="small"
            label="Başlık ara"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <TextField
            size="small"
            select
            label="Kategori"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {Object.keys(categoryColors).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            label="Sıralama"
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">Yok</MenuItem>
            <MenuItem value="title">Başlık</MenuItem>
            <MenuItem value="category">Kategori</MenuItem>
            <MenuItem value="createdAt">Tarih</MenuItem> {/* ✅ Eklendi */}
          </TextField>
          <TextField
            size="small"
            select
            label="Yön"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="asc">A-Z</MenuItem>
            <MenuItem value="desc">Z-A</MenuItem>
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

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Başlık</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tarih</TableCell>{" "}
                {/* ✅ Yeni sütun */}
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
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
                    "& td": { py: 0.7, px: 1 },
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
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
                    {dayjs(post.createdAt).format("DD.MM.YYYY")}{" "}
                    {/* ✅ Tarih formatı */}
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
                          onClick={() => handleDeleteRequest(post._id)}
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
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(14px)",
            borderRadius: 3,
          },
        }}
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
