import React, { useState, useEffect } from "react";
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

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Kategorileri localStorage'tan al
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("categories"));
    if (stored && stored.length > 0) {
      setCategories(stored);
    } else {
      const defaultCategories = ["React", "JavaScript", "Tasarım"];
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
      setCategories(defaultCategories);
    }
  }, []);
  // Kategori ekle/güncelle
  const handleSave = () => {
    if (categoryInput.trim() === "") return;

    const updated = [...categories];
    if (editingIndex !== null) {
      updated[editingIndex] = categoryInput;
    } else {
      updated.unshift(categoryInput);
    }
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    setOpenDialog(false);
    setCategoryInput("");
    setEditingIndex(null);
  };

  const handleDelete = () => {
    const updated = categories.filter((_, i) => i !== deleteIndex);
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    setConfirmDelete(false);
    setDeleteIndex(null);
  };

  const openEditDialog = (name, index) => {
    setEditingIndex(index);
    setCategoryInput(name);
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
          Kategoriler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingIndex(null);
            setCategoryInput("");
            setOpenDialog(true);
          }}
        >
          Kategori Ekle
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
              {categories.map((category, index) => (
                <TableRow key={index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(category, index)}
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
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Henüz kategori eklenmedi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Ekle / Düzenle */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingIndex !== null ? "Kategoriyi Düzenle" : "Yeni Kategori"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Kategori Adı"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
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
        <DialogTitle>
          Bu kategoriyi silmek istediğinize emin misiniz?
        </DialogTitle>
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

export default AdminCategoriesPage;
