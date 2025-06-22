import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  React: "primary",
  JavaScript: "warning",
  Tasarım: "secondary",
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostsPage = () => {
  const navigate = useNavigate();

  const [allPosts, setAllPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "https://materialblog-server-production.up.railway.app//api/posts"
      );
      setAllPosts(res.data);
    } catch (err) {
      console.error("Yazılar çekilemedi:", err);
      showSnackbar("Yazılar alınamadı", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddPost = async (newPost) => {
    try {
      if (editingPost) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app//api/posts/${editingPost._id}`,
          newPost
        );
        showSnackbar("Yazı güncellendi!");
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app//api/posts",
          newPost
        );
        showSnackbar("Yazı başarıyla eklendi!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      fetchPosts();
      setOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error("Ekleme/Güncelleme hatası:", err);
      showSnackbar("İşlem sırasında hata oluştu", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      await axios.delete(
        `https://materialblog-server-production.up.railway.app//api/posts/${postToDelete}`
      );
      fetchPosts();
      showSnackbar("Yazı başarıyla silindi!", "info");
    } catch (err) {
      console.error("Silme hatası:", err);
      showSnackbar("Silme işlemi başarısız", "error");
    } finally {
      setConfirmDelete(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteRequest = (id) => {
    setPostToDelete(id);
    setConfirmDelete(true);
  };

  const handleEditPost = (post) => {
    navigate(`/admin/posts/edit/${post._id}`);
  };

  return (
    <Box sx={{ pt: 1 }}>
      {/* Üst başlık ve ekle butonu */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          px: 2,
          py: 1.5,
          bgcolor: (theme) => theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" fontWeight={700} letterSpacing={0.5}>
          Yazılar
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/editor")}
        >
          Yeni Yazı
        </Button>
      </Box>

      {/* Yazılar Tablosu */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Başlık</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allPosts.map((post) => (
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
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEditPost(post)}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* SİLME ONAY DİYALOĞU */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Bu yazıyı silmek istediğinize emin misiniz?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Vazgeç</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR BİLDİRİM */}
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
