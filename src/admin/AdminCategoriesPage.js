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
import axios from "axios";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://materialblog-server-production.up.railway.app/api/categories"
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Kategoriler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (categoryInput.trim() === "") return;

    try {
      if (editingCategory) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app/api/categories/${editingCategory._id}`,
          {
            name: categoryInput,
          }
        );
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app/api/categories",
          { name: categoryInput }
        );
      }
      fetchCategories();
      setOpenDialog(false);
      setCategoryInput("");
      setEditingCategory(null);
    } catch (err) {
      console.error("Kategori kaydetme hatası:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://materialblog-server-production.up.railway.app/api/categories/${deleteCategoryId}`
      );
      fetchCategories();
      setConfirmDelete(false);
      setDeleteCategoryId(null);
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setCategoryInput(category.name);
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Kategoriler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingCategory(null);
            setCategoryInput("");
            setOpenDialog(true);
          }}
          sx={{ borderRadius: 3 }}
        >
          Kategori Ekle
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
              {categories.map((category, index) => (
                <TableRow
                  key={category._id}
                  hover
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteCategoryId(category._id);
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
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle>
          {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
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
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            p: 2,
          },
        }}
      >
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
