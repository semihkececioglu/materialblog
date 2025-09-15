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
  CardActions,
  Grid,
  Fade,
  Snackbar,
  Alert,
  Avatar,
  Divider,
  Stack,
  Badge,
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

// Glassmorphism styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.paper, 0.7)})`,
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${alpha(
      theme.palette.primary.main,
      0.5
    )}, transparent)`,
  },
}));

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { items: categories = [], loading } = useSelector((s) => s.categories);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [query, setQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Prevent animations on initial load and after operations
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    // Enable animations after initial load
    const timer = setTimeout(() => setShouldAnimate(true), 500);
    return () => clearTimeout(timer);
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
    setCategoryInput(cat.name);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!categoryInput.trim()) return;
    try {
      // Temporarily disable animations during save
      setShouldAnimate(false);

      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            updatedData: { name: categoryInput.trim() },
          })
        );
        showSnackbar("Kategori başarıyla güncellendi!");
      } else {
        await dispatch(createCategory({ name: categoryInput.trim() }));
        showSnackbar("Yeni kategori başarıyla eklendi!");
      }
      setOpenDialog(false);
      setCategoryInput("");
      setEditingCategory(null);

      // Re-enable animations after a short delay
      setTimeout(() => setShouldAnimate(true), 100);
    } catch (error) {
      showSnackbar("İşlem sırasında bir hata oluştu!", "error");
      setShouldAnimate(true);
    }
  };

  const handleDelete = async () => {
    try {
      setShouldAnimate(false);
      await dispatch(deleteCategory(deleteCategoryId));
      showSnackbar("Kategori başarıyla silindi!");
      setConfirmDelete(false);
      setDeleteCategoryId(null);
      setTimeout(() => setShouldAnimate(true), 100);
    } catch (error) {
      showSnackbar("Silme işlemi sırasında bir hata oluştu!", "error");
      setShouldAnimate(true);
    }
  };

  const clearFilters = () => {
    setQuery("");
  };

  const CategoryCard = ({ category, index }) => (
    <GlassCard
      elevation={0}
      sx={{
        height: "100%",
        transition: shouldAnimate ? "all 0.3s ease" : "none",
        cursor: "pointer",
        "&:hover": {
          transform: shouldAnimate ? "translateY(-4px)" : "none",
          boxShadow: (t) =>
            `0 12px 24px ${alpha(t.palette.primary.main, 0.15)}`,
          "& .category-actions": {
            opacity: 1,
          },
          "& .category-avatar": {
            transform: shouldAnimate ? "scale(1.05)" : "none",
          },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            className="category-avatar"
            sx={(t) => ({
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
              transition: shouldAnimate ? "all 0.3s ease" : "none",
            })}
          >
            <FolderIcon sx={{ fontSize: 24, color: "white" }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {category.name}
            </Typography>
            <Chip
              size="small"
              icon={<TrendingUpIcon sx={{ fontSize: 12 }} />}
              label={`#${index + 1}`}
              sx={(t) => ({
                height: 20,
                fontSize: 10,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${alpha(
                  t.palette.success.main,
                  0.1
                )}, ${alpha(t.palette.success.main, 0.05)})`,
                color: "success.main",
                "& .MuiChip-label": { px: 0.8 },
              })}
            />
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5, opacity: 0.6 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: "0.7rem",
            opacity: 0.8,
            display: "block",
            mb: 2,
          }}
        >
          ID: {category._id?.slice(-6)}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          className="category-actions"
          sx={{
            opacity: { xs: 1, sm: 0.7 }, // Always visible on mobile
            transition: shouldAnimate ? "all 0.3s ease" : "none",
          }}
        >
          <Button
            fullWidth
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 14 }} />}
            onClick={() => openEditDialog(category)}
            sx={(t) => ({
              height: 32,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 12,
              background: `linear-gradient(135deg, ${alpha(
                t.palette.primary.main,
                0.1
              )}, ${alpha(t.palette.primary.main, 0.05)})`,
              color: "primary.main",
              border: `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, ${alpha(
                  t.palette.primary.main,
                  0.2
                )}, ${alpha(t.palette.primary.main, 0.1)})`,
              },
            })}
          >
            Düzenle
          </Button>
          <IconButton
            size="small"
            onClick={() => {
              setDeleteCategoryId(category._id);
              setConfirmDelete(true);
            }}
            sx={(t) => ({
              width: 32,
              height: 32,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(
                t.palette.error.main,
                0.1
              )}, ${alpha(t.palette.error.main, 0.05)})`,
              color: "error.main",
              border: `1px solid ${alpha(t.palette.error.main, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, ${alpha(
                  t.palette.error.main,
                  0.2
                )}, ${alpha(t.palette.error.main, 0.1)})`,
              },
            })}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </CardContent>
    </GlassCard>
  );

  const CategoryCardSkeleton = () => (
    <GlassCard elevation={0} sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="80%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton width={60} height={20} />
          </Box>
        </Stack>
        <Skeleton width="100%" height={1} sx={{ my: 1.5 }} />
        <Skeleton width="40%" height={16} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1}>
          <Skeleton width="70%" height={32} />
          <Skeleton width={32} height={32} />
        </Stack>
      </CardContent>
    </GlassCard>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (t) =>
          t.palette.mode === "dark"
            ? `radial-gradient(ellipse at 30% 20%, ${alpha(
                t.palette.primary.main,
                0.1
              )}, transparent 50%), 
               radial-gradient(ellipse at 70% 80%, ${alpha(
                 t.palette.secondary.main,
                 0.08
               )}, transparent 50%),
               ${t.palette.background.default}`
            : `radial-gradient(ellipse at 30% 20%, ${alpha(
                t.palette.primary.light,
                0.2
              )}, transparent 60%), 
               radial-gradient(ellipse at 70% 80%, ${alpha(
                 t.palette.secondary.light,
                 0.15
               )}, transparent 60%),
               ${t.palette.background.default}`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        {/* COMPACT HEADER */}
        <Paper
          elevation={0}
          sx={(t) => ({
            mb: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            background:
              t.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    t.palette.background.paper,
                    0.9
                  )}, ${alpha(t.palette.background.default, 0.95)})`
                : `linear-gradient(145deg, ${alpha("#fff", 0.95)}, ${alpha(
                    "#f8fafc",
                    0.9
                  )})`,
            border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
          })}
        >
          {/* Title Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={(t) => ({
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                  boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.3)}`,
                })}
              >
                <CategoryIcon sx={{ fontSize: 24, color: "white" }} />
              </Avatar>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    mb: 0.5,
                    background: (t) =>
                      `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  Kategori Yönetimi
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  <Badge
                    badgeContent={categories.length}
                    color="primary"
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  >
                    <Chip
                      icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                      label="Toplam"
                      size="small"
                      sx={{
                        height: 28,
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                        color: "primary.main",
                        fontSize: 11,
                      }}
                    />
                  </Badge>
                  <Badge
                    badgeContent={filtered.length}
                    color="secondary"
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  >
                    <Chip
                      icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                      label="Görüntülenen"
                      size="small"
                      sx={{
                        height: 28,
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.success.main, 0.15),
                        color: "success.main",
                        fontSize: 11,
                      }}
                    />
                  </Badge>
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCategory(null);
                setCategoryInput("");
                setOpenDialog(true);
              }}
              sx={(t) => ({
                height: 40,
                borderRadius: 3,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 700,
                px: 3,
                background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.3)}`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${alpha(t.palette.primary.main, 0.4)}`,
                },
                transition: "all 0.3s ease",
              })}
            >
              Yeni Kategori
            </Button>
          </Stack>

          {/* Search Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kategori ara..."
              sx={(t) => ({
                flex: 1,
                maxWidth: { sm: 400 },
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: 3,
                  background: alpha(t.palette.background.default, 0.6),
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    background: alpha(t.palette.background.default, 0.8),
                  },
                  "&.Mui-focused": {
                    background: alpha(t.palette.background.default, 0.9),
                    boxShadow: `0 0 0 2px ${alpha(
                      t.palette.primary.main,
                      0.2
                    )}`,
                  },
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearFilters}
                      sx={(t) => ({
                        color: "text.secondary",
                        "&:hover": {
                          color: "error.main",
                          bgcolor: alpha(t.palette.error.main, 0.1),
                        },
                      })}
                    >
                      <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {query && (
              <Button
                variant="outlined"
                onClick={clearFilters}
                size="small"
                sx={{
                  height: 40,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 12,
                  px: 2,
                  borderColor: (t) => alpha(t.palette.error.main, 0.3),
                  color: "error.main",
                  "&:hover": {
                    borderColor: "error.main",
                    bgcolor: (t) => alpha(t.palette.error.main, 0.05),
                  },
                }}
                startIcon={<ClearIcon fontSize="small" />}
              >
                Temizle
              </Button>
            )}
          </Stack>
        </Paper>

        {/* CONTENT AREA */}
        <Fade in timeout={300}>
          <Grid container spacing={2}>
            {loading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`sk-${i}`}>
                  <CategoryCardSkeleton />
                </Grid>
              ))}

            {!loading && filtered.length === 0 && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={(t) => ({
                    py: 6,
                    textAlign: "center",
                    borderRadius: 4,
                    background: alpha(t.palette.background.paper, 0.6),
                    border: `1px dashed ${alpha(t.palette.divider, 0.3)}`,
                  })}
                >
                  <Avatar
                    sx={(t) => ({
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      background: `linear-gradient(135deg, ${alpha(
                        t.palette.text.disabled,
                        0.1
                      )}, ${alpha(t.palette.text.disabled, 0.05)})`,
                    })}
                  >
                    <CategoryIcon
                      sx={{ fontSize: 40, color: "text.disabled" }}
                    />
                  </Avatar>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Kategori bulunamadı
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    sx={{ mb: 2 }}
                  >
                    {query
                      ? "Arama kriterlerinizi değiştirin"
                      : "Henüz kategori eklenmemiş"}
                  </Typography>
                  {query && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={clearFilters}
                      startIcon={<ClearIcon />}
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Filtreleri Temizle
                    </Button>
                  )}
                </Paper>
              </Grid>
            )}

            {!loading &&
              filtered.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
                  <CategoryCard category={category} index={index} />
                </Grid>
              ))}
          </Grid>
        </Fade>

        {/* Standard Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: (t) => alpha(t.palette.background.paper, 0.95),
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <DialogTitle>
            {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Kategori Adı"
              fullWidth
              variant="outlined"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>İptal</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!categoryInput.trim()}
            >
              {editingCategory ? "Güncelle" : "Ekle"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Standard Delete Confirmation Dialog */}
        <Dialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: (t) => alpha(t.palette.background.paper, 0.95),
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <DialogTitle>Kategoriyi Sil</DialogTitle>
          <DialogContent>
            <Typography>
              Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)}>İptal</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* Standard Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminCategoriesPage;
