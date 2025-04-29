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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminTagsPage = () => {
  const [tags, setTags] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tags"));
    if (stored && stored.length > 0) {
      setTags(stored);
    } else {
      const defaultTags = ["frontend", "react", "ui"];
      localStorage.setItem("tags", JSON.stringify(defaultTags));
      setTags(defaultTags);
    }
  }, []);

  const handleSave = () => {
    if (tagInput.trim() === "") return;

    const updated = [...tags];
    if (editingIndex !== null) {
      updated[editingIndex] = tagInput;
    } else {
      updated.unshift(tagInput);
    }
    setTags(updated);
    localStorage.setItem("tags", JSON.stringify(updated));
    setOpenDialog(false);
    setTagInput("");
    setEditingIndex(null);
  };

  const handleDelete = () => {
    const updated = tags.filter((_, i) => i !== deleteIndex);
    setTags(updated);
    localStorage.setItem("tags", JSON.stringify(updated));
    setConfirmDelete(false);
    setDeleteIndex(null);
  };

  const openEditDialog = (name, index) => {
    setEditingIndex(index);
    setTagInput(name);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Etiketler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingIndex(null);
            setTagInput("");
            setOpenDialog(true);
          }}
        >
          Etiket Ekle
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Adı</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag, index) => (
                <TableRow key={index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{tag}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(tag, index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteIndex(index);
                        setConfirmDelete(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {tags.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Henüz etiket eklenmedi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingIndex !== null ? "Etiketi Düzenle" : "Yeni Etiket"}
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
