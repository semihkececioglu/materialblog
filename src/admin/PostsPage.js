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
  DialogContent,
  AppBar,
  Toolbar,
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
import CloseIcon from "@mui/icons-material/Close";
import initialPosts from "../data";
import PostForm from "./PostForm";

const categoryColors = {
  React: "primary",
  JavaScript: "warning",
  Tasarım: "secondary",
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostsPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const merged = [
      ...storedPosts,
      ...initialPosts.filter(
        (post) => !storedPosts.some((p) => p.id === post.id)
      ),
    ];
    setAllPosts(merged);
  }, []);

  const handleAddPost = (newPost) => {
    let updated;
    if (editingPost) {
      updated = allPosts.map((post) =>
        post.id === editingPost.id ? newPost : post
      );
      setSnackbarMessage("Yazı güncellendi!");
    } else {
      updated = [newPost, ...allPosts];
      setSnackbarMessage("Yazı başarıyla eklendi!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setAllPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    setOpen(false);
    setEditingPost(null);
  };

  const handleDeleteConfirm = () => {
    if (!postToDelete) return;
    const updated = allPosts.filter((post) => post.id !== postToDelete);
    setAllPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    setConfirmDelete(false);
    setPostToDelete(null);
    setSnackbarMessage("Yazı başarıyla silindi!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setPostToDelete(id);
    setConfirmDelete(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setOpen(true);
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Yazılar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingPost(null);
            setOpen(true);
          }}
        >
          Yeni Yazı
        </Button>
      </Box>

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
                <TableRow
                  key={post.id}
                  hover
                  sx={{
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: 3,
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={post.category}
                      color={categoryColors[post.category] || "default"}
                      size="small"
                      variant="filled"
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
                      onClick={() => handleDeleteRequest(post.id)}
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

      {/* TAM EKRAN FORM */}
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {editingPost ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <PostForm onSubmit={handleAddPost} initialData={editingPost} />
        </DialogContent>
      </Dialog>

      {/* SİLME ONAY DİALOGU */}
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

      {/* BİLDİRİM SNACKBAR */}
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
