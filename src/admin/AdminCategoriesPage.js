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
  CircularProgress,
  Container,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";
import CategoryIcon from "@mui/icons-material/Category";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../redux/categoriesSlice";

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector(
    (state) => state.categories
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSave = async () => {
    if (categoryInput.trim() === "") return;

    if (editingCategory) {
      await dispatch(
        updateCategory({
          id: editingCategory._id,
          updatedData: { name: categoryInput },
        })
      );
    } else {
      await dispatch(createCategory({ name: categoryInput }));
    }

    setOpenDialog(false);
    setCategoryInput("");
    setEditingCategory(null);
  };

  const handleDelete = async () => {
    await dispatch(deleteCategory(deleteCategoryId));
    setConfirmDelete(false);
    setDeleteCategoryId(null);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setCategoryInput(category.name);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CategoryIcon
              sx={{
                fontSize: 32,
                color: "primary.main",
              }}
            />
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}
              >
                Kategoriler
              </Typography>
              <Chip
                label={`${categories.length} kategori`}
                size="small"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  fontWeight: 500,
                  height: "24px",
                }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCategory(null);
              setCategoryInput("");
              setOpenDialog(true);
            }}
            sx={{
              borderRadius: "8px",
              px: 2,
              py: 0.75,
              bgcolor: "primary.main",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Yeni Kategori
          </Button>
        </Box>
      </Paper>

      {/* Categories Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      py: 2,
                      px: 3,
                      fontWeight: 600,
                      width: "60px",
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    sx={{
                      py: 2,
                      px: 3,
                      fontWeight: 600,
                    }}
                  >
                    Kategori Adı
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: 2,
                      px: 3,
                      fontWeight: 600,
                      width: "120px",
                    }}
                  >
                    İşlemler
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow
                    key={category._id}
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
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          width: 24,
                          height: 24,
                          borderRadius: "6px",
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.875rem",
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography sx={{ fontWeight: 500 }}>
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2, px: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(category)}
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
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setDeleteCategoryId(category._id);
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
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        textAlign: "center",
                        py: 8,
                        color: "text.secondary",
                      }}
                    >
                      <CategoryIcon
                        sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                      />
                      <Typography>Henüz kategori eklenmedi.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            fullWidth
            label="Kategori Adı"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            {editingCategory ? "Güncelle" : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Kategoriyi Sil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bu kategoriyi silmek istediğinize emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setConfirmDelete(false)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCategoriesPage;
