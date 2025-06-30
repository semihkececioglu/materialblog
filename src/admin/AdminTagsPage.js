import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, deleteTag } from "../redux/tagSlice";
import axios from "axios";

const AdminTagsPage = () => {
  const dispatch = useDispatch();
  const { items: tags, loading } = useSelector((state) => state.tags);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);

  // Redux üzerinden etiketleri çek
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleSave = async () => {
    if (tagInput.trim() === "") return;

    try {
      if (editingTag) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app/api/tags/${editingTag._id}`,
          { name: tagInput }
        );
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app/api/tags",
          { name: tagInput }
        );
      }
      dispatch(fetchTags());
      setOpenDialog(false);
      setTagInput("");
      setEditingTag(null);
    } catch (err) {
      console.error("Etiket kaydetme hatası:", err);
    }
  };

  const handleDelete = async () => {
    dispatch(deleteTag(deleteTagId));
    setConfirmDelete(false);
    setDeleteTagId(null);
  };

  const openEditDialog = (tag) => {
    setEditingTag(tag);
    setTagInput(tag.name);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Etiketler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTag(null);
            setTagInput("");
            setOpenDialog(true);
          }}
          sx={{ borderRadius: 3 }}
        >
          Etiket Ekle
        </Button>
      </Box>

      <Paper
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell>#</TableCell>
                <TableCell>Adı</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Henüz etiket eklenmedi.
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag, index) => (
                  <TableRow
                    key={tag._id}
                    hover
                    sx={{
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialog(tag)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeleteTagId(tag._id);
                          setConfirmDelete(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Etiket Ekle / Düzenle Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingTag ? "Etiketi Düzenle" : "Yeni Etiket"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Etiket Adı"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleSave} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme onayı */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Bu etiketi silmek istediğinize emin misiniz?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Vazgeç</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTagsPage;
