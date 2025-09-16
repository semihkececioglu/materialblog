import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Container,
  Chip,
  Tooltip,
  Skeleton,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Fade,
  Snackbar,
  Alert,
  Avatar,
  Divider,
  Stack,
  Badge,
  FormControlLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FolderIcon from "@mui/icons-material/Folder";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ClearIcon from "@mui/icons-material/Clear";
import { alpha, styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../redux/categoriesSlice";

const SKELETON_ROWS = 6;

const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.paper, 0.7)})`,
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: 16,
  overflow: "hidden",
}));

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { items: categories = [], loading } = useSelector((s) => s.categories);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState({
    name: "",
    description: "",
    color: "#999999",
    icon: "",
    featured: false,
    parent: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [query, setQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const openEditDialog = (cat) => {
    setEditingCategory(cat);
    setCategoryInput({
      name: cat.name || "",
      description: cat.description || "",
      color: cat.color || "#999999",
      icon: cat.icon || "",
      featured: cat.featured || false,
      parent: cat.parent || "",
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!categoryInput.name.trim()) return;
    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            updatedData: categoryInput,
          })
        );
        showSnackbar("Kategori başarıyla güncellendi!");
      } else {
        await dispatch(createCategory(categoryInput));
        showSnackbar("Yeni kategori başarıyla eklendi!");
      }
      setOpenDialog(false);
      setCategoryInput({
        name: "",
        description: "",
        color: "#999999",
        icon: "",
        featured: false,
        parent: "",
      });
      setEditingCategory(null);
    } catch (error) {
      showSnackbar("İşlem sırasında bir hata oluştu!", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(deleteCategoryId));
      showSnackbar("Kategori başarıyla silindi!");
      setConfirmDelete(false);
      setDeleteCategoryId(null);
    } catch (error) {
      showSnackbar("Silme işlemi sırasında bir hata oluştu!", "error");
    }
  };

  const clearFilters = () => setQuery("");

  const CategoryCard = ({ category }) => (
    <GlassCard elevation={0}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: category.color || "primary.main",
            }}
          >
            <FolderIcon sx={{ fontSize: 24, color: "white" }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {category.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.75rem", color: "text.secondary" }}
            >
              {category.description || "-"}
            </Typography>
          </Box>
          {category.featured && (
            <Chip
              size="small"
              color="primary"
              label="Featured"
              sx={{ fontSize: 10, fontWeight: 600 }}
            />
          )}
        </Stack>
        <Divider sx={{ my: 1.5, opacity: 0.6 }} />
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => openEditDialog(category)}
          >
            Düzenle
          </Button>
          <IconButton
            size="small"
            onClick={() => {
              setDeleteCategoryId(category._id);
              setConfirmDelete(true);
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      </CardContent>
    </GlassCard>
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ mb: 3, p: 3, borderRadius: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Typography variant="h5" fontWeight={700}>
              Kategori Yönetimi
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCategory(null);
                setCategoryInput({
                  name: "",
                  description: "",
                  color: "#999999",
                  icon: "",
                  featured: false,
                  parent: "",
                });
                setOpenDialog(true);
              }}
            >
              Yeni Kategori
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={2}>
          {loading &&
            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={120} />
              </Grid>
            ))}
          {!loading &&
            filtered.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <CategoryCard category={category} />
              </Grid>
            ))}
        </Grid>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
        >
          <DialogTitle>
            {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Kategori Adı"
              fullWidth
              margin="dense"
              value={categoryInput.name}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
            <TextField
              label="Açıklama"
              fullWidth
              margin="dense"
              multiline
              minRows={2}
              value={categoryInput.description}
              onChange={(e) =>
                setCategoryInput({
                  ...categoryInput,
                  description: e.target.value,
                })
              }
            />
            <TextField
              label="Renk"
              type="color"
              margin="dense"
              fullWidth
              value={categoryInput.color}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, color: e.target.value })
              }
            />
            <TextField
              label="Icon (MUI ad)"
              margin="dense"
              fullWidth
              value={categoryInput.icon}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, icon: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={categoryInput.featured}
                  onChange={(e) =>
                    setCategoryInput({
                      ...categoryInput,
                      featured: e.target.checked,
                    })
                  }
                />
              }
              label="Featured (Sidebar’da göster)"
            />
            <TextField
              select
              label="Parent Kategori"
              fullWidth
              margin="dense"
              value={categoryInput.parent}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, parent: e.target.value })
              }
            >
              <MenuItem value="">(Yok)</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>İptal</Button>
            <Button onClick={handleSave} variant="contained">
              {editingCategory ? "Güncelle" : "Ekle"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>Kategoriyi Sil</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)}>İptal</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminCategoriesPage;
