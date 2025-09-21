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
  Slide,
  Grow,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  SearchRounded as SearchRoundedIcon,
  CloseRounded as CloseRoundedIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
  Clear as ClearIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Description as DescriptionIcon,
  AccountTree as AccountTreeIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Sports as SportsIcon,
  LibraryMusic as MusicIcon,
  Camera as CameraIcon,
  Book as BookIcon,
  Code as CodeIcon,
  CardTravel as TravelIcon,
  Restaurant as RestaurantIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthIcon,
  Nature as NatureIcon,
  Brush as ArtIcon,
  Games as GamesIcon,
  Movie as MovieIcon,
  Build as BuildIcon,
  DirectionsCar as DirectionsCarIcon,
  LocalLibrary as LocalLibraryIcon,
  MoreVert as MoreVertIcon,
  ImportExport as ImportExportIcon,
} from "@mui/icons-material";
import { alpha, styled, darken } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../redux/categoriesSlice";

const SKELETON_ROWS = 6;
const CONTROL_H = 42;

// Önceden tanımlanmış ikonlar
const AVAILABLE_ICONS = [
  { name: "Category", icon: CategoryIcon, label: "Kategori" },
  { name: "Folder", icon: FolderIcon, label: "Klasör" },
  { name: "Star", icon: StarIcon, label: "Yıldız" },
  { name: "Home", icon: HomeIcon, label: "Ev" },
  { name: "Work", icon: WorkIcon, label: "İş" },
  { name: "Sports", icon: SportsIcon, label: "Spor" },
  { name: "Music", icon: MusicIcon, label: "Müzik" },
  { name: "Camera", icon: CameraIcon, label: "Fotoğraf" },
  { name: "Book", icon: BookIcon, label: "Kitap" },
  { name: "Code", icon: CodeIcon, label: "Kod" },
  { name: "Travel", icon: TravelIcon, label: "Seyahat" },
  { name: "Restaurant", icon: RestaurantIcon, label: "Yemek" },
  { name: "Science", icon: ScienceIcon, label: "Bilim" },
  { name: "School", icon: SchoolIcon, label: "Eğitim" },
  { name: "Business", icon: BusinessIcon, label: "İş Dünyası" },
  { name: "Health", icon: HealthIcon, label: "Sağlık" },
  { name: "Nature", icon: NatureIcon, label: "Doğa" },
  { name: "Art", icon: ArtIcon, label: "Sanat" },
  { name: "Games", icon: GamesIcon, label: "Oyun" },
  { name: "Movie", icon: MovieIcon, label: "Film" },
  { name: "Build", icon: BuildIcon, label: "Araçlar" },
  { name: "DirectionsCar", icon: DirectionsCarIcon, label: "Otomobil" },
  { name: "LocalLibrary", icon: LocalLibraryIcon, label: "Kütüphane" },
];

// Önceden tanımlanmış renkler
const PRESET_COLORS = [
  "#1976d2",
  "#388e3c",
  "#f57c00",
  "#d32f2f",
  "#7b1fa2",
  "#0288d1",
  "#689f38",
  "#fbc02d",
  "#e64a19",
  "#512da8",
  "#0097a7",
  "#558b2f",
  "#ffa000",
  "#5d4037",
  "#455a64",
  "#303f9f",
  "#1976d2",
  "#0288d1",
  "#0097a7",
  "#00695c",
  "#2e7d32",
  "#558b2f",
  "#827717",
  "#f57f17",
  "#ff8f00",
  "#f57c00",
  "#e65100",
  "#d84315",
  "#bf360c",
  "#3e2723",
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledCard = styled(Card)(({ theme, categoryColor }) => ({
  height: 280,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.95
  )}, ${alpha(theme.palette.background.default, 0.8)})`,
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  borderRadius: 20,
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 20px 40px ${alpha(
      categoryColor || theme.palette.primary.main,
      0.25
    )}`,
    border: `1px solid ${alpha(
      categoryColor || theme.palette.primary.main,
      0.3
    )}`,
    "&:before": {
      transform: "translateX(0)",
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${
      categoryColor || theme.palette.primary.main
    }, ${alpha(categoryColor || theme.palette.primary.main, 0.7)})`,
    transform: "translateX(-100%)",
    transition: "transform 0.4s ease",
  },
}));

const StyledAvatar = styled(Avatar)(({ categoryColor, theme }) => ({
  width: 64,
  height: 64,
  background: `linear-gradient(135deg, ${
    categoryColor || theme.palette.primary.main
  }, ${darken(categoryColor || theme.palette.primary.main, 0.2)})`,
  boxShadow: `0 8px 24px ${alpha(
    categoryColor || theme.palette.primary.main,
    0.3
  )}`,
  border: `3px solid ${alpha(
    categoryColor || theme.palette.primary.main,
    0.2
  )}`,
  transition: "all 0.3s ease",
}));

const ColorPickerButton = styled(Box)(({ color, selected, theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: color,
  cursor: "pointer",
  border: selected
    ? `3px solid ${theme.palette.primary.main}`
    : `2px solid ${alpha(color, 0.3)}`,
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    // transform: "scale(1.1)", // scale kaldırıldı
    boxShadow: `0 4px 12px ${alpha(color, 0.4)}`,
  },
  "&:after": selected
    ? {
        content: '"✓"',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      }
    : undefined,
}));

// IconPickerButton'u güncelleyin
const IconPickerButton = styled(Box)(({ selected, theme }) => ({
  width: 48, // 60'dan 48'e küçültüldü
  height: 48, // 60'dan 48'e küçültüldü
  borderRadius: "50%", // Daire formuna getirildi
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.background.default, 0.5),
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { items: categories = [], loading } = useSelector((s) => s.categories);

  const [viewMode, setViewMode] = useState("grid");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState({
    name: "",
    description: "",
    color: "#1976d2",
    icon: "Category",
    featured: false,
    parent: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [query, setQuery] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Yeni state'ler
  const [nameSort, setNameSort] = useState(""); // "asc" | "desc" | ""
  const [statusFilter, setStatusFilter] = useState(""); // "featured" | "subcategory" | ""
  const [currentPage, setCurrentPage] = useState(1);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const itemsPerPage = viewMode === "grid" ? 6 : 10; // Grid için 6, tablo için 10

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Kategorileri hiyerarşik şekilde organize eden fonksiyon
  const organizeCategories = (categories) => {
    const parentCategories = categories.filter((cat) => !cat.parent);
    const childCategories = categories.filter((cat) => cat.parent);

    const organized = [];

    parentCategories.forEach((parent) => {
      organized.push(parent);

      // Bu parent'ın alt kategorilerini bul ve ekle
      const children = childCategories.filter(
        (child) => child.parent === parent._id
      );
      organized.push(...children);
    });

    // Parent'ı olmayan alt kategorileri de ekle (orphan kategoriler)
    const orphanChildren = childCategories.filter(
      (child) => !parentCategories.find((parent) => parent._id === child.parent)
    );
    organized.push(...orphanChildren);

    return organized;
  };

  const filtered = useMemo(() => {
    let result = [...categories]; // Array kopyalama ile immutable hale getir

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    if (showFeaturedOnly) {
      result = result.filter((c) => c.featured);
    }

    // Durum filtresi
    if (statusFilter === "featured") {
      result = result.filter((c) => c.featured);
    } else if (statusFilter === "subcategory") {
      result = result.filter((c) => c.parent);
    }

    // İsim sıralaması
    if (nameSort === "asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    } else if (nameSort === "desc") {
      result.sort((a, b) => b.name.localeCompare(a.name, "tr"));
    }

    return result;
  }, [categories, query, showFeaturedOnly, statusFilter, nameSort]);

  // Sayfalama
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCategories = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getIconComponent = (iconName) => {
    const iconData = AVAILABLE_ICONS.find((icon) => icon.name === iconName);
    return iconData ? iconData.icon : CategoryIcon;
  };

  const openEditDialog = (cat) => {
    setEditingCategory(cat);
    setCategoryInput({
      name: cat.name || "",
      description: cat.description || "",
      color: cat.color || "#1976d2",
      icon: cat.icon || "Category",
      featured: cat.featured || false,
      parent: cat.parent || "",
    });
    setOpenDialog(true);
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setCategoryInput({
      name: "",
      description: "",
      color: "#1976d2",
      icon: "Category",
      featured: false,
      parent: "",
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!categoryInput.name.trim()) {
      showSnackbar("Kategori adı gereklidir!", "error");
      return;
    }

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            updatedData: categoryInput,
          })
        ).unwrap();
        showSnackbar("Kategori başarıyla güncellendi!", "success");
      } else {
        await dispatch(createCategory(categoryInput)).unwrap();
        showSnackbar("Yeni kategori başarıyla eklendi!", "success");
      }
      setOpenDialog(false);
      setCategoryInput({
        name: "",
        description: "",
        color: "#1976d2",
        icon: "Category",
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
      await dispatch(deleteCategory(deleteCategoryId)).unwrap();
      showSnackbar("Kategori başarıyla silindi!", "info");
      setConfirmDelete(false);
      setDeleteCategoryId(null);
    } catch (error) {
      showSnackbar("Silme işlemi sırasında bir hata oluştu!", "error");
    }
  };

  // İsim sıralaması toggle - hata düzeltmesi
  const handleNameSort = (event) => {
    event.stopPropagation(); // Event propagation'ı durdur

    if (nameSort === "") {
      setNameSort("asc");
    } else if (nameSort === "asc") {
      setNameSort("desc");
    } else {
      setNameSort("");
    }
    setCurrentPage(1);
  };

  // Durum filtresi
  const handleStatusFilter = (filter) => {
    setStatusFilter(filter);
    setStatusAnchorEl(null);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setShowFeaturedOnly(false);
    setStatusFilter("");
    setNameSort("");
    setCurrentPage(1);
  };

  const getCategoryColor = (color) => color || "#1976d2";

  const handleToggleFeatured = async (category) => {
    try {
      await dispatch(
        updateCategory({
          id: category._id,
          updatedData: { ...category, featured: !category.featured },
        })
      ).unwrap();
      showSnackbar(
        `Kategori ${
          category.featured ? "öne çıkandan çıkarıldı" : "öne çakana eklendi"
        }!`,
        "success"
      );
    } catch (error) {
      showSnackbar("İşlem sırasında bir hata oluştu!", "error");
    }
    // handleMenuClose(); // Bu satırı kaldırın
  };

  // Yazı sayısını kategoriden al (backend'den geliyorsa)
  const getPostCount = (category) => {
    // Eğer kategori objesinde postCount varsa
    return (
      category.postCount || category.postsCount || category.posts?.length || 0
    );
  };

  const CategoryCard = React.memo(({ category }) => {
    const categoryColor = getCategoryColor(category.color);
    const IconComponent = getIconComponent(category.icon);
    const postCount = getPostCount(category);

    return (
      <StyledCard elevation={0} categoryColor={categoryColor}>
        <CardContent
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Icon */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <StyledAvatar categoryColor={categoryColor}>
              <IconComponent sx={{ fontSize: 24, color: "white" }} />
            </StyledAvatar>
          </Stack>

          {/* Category Info */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {category.name}
              </Typography>
              {category.parent && (
                <Chip
                  icon={<AccountTreeIcon sx={{ fontSize: 10 }} />}
                  label={
                    categories.find((c) => c._id === category.parent)?.name ||
                    "Bilinmeyen"
                  }
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    bgcolor: alpha(categoryColor, 0.15),
                    color: darken(categoryColor, 0.4),
                    fontWeight: 600,
                    maxWidth: 80,
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                    "& .MuiChip-icon": {
                      marginLeft: "4px",
                      marginRight: "-2px",
                    },
                  }}
                />
              )}
            </Stack>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.85rem",
                color: "text.secondary",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.4em",
              }}
            >
              {category.description || "Açıklama bulunmuyor..."}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Stats and Tags */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mb: 2,
              "& > *": {
                flexShrink: 0,
              },
            }}
          >
            <Chip
              label={`${postCount} Yazı`}
              size="small"
              sx={{
                bgcolor: (t) => alpha(categoryColor, 0.1),
                color: categoryColor,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
              }}
            />

            {category.featured && (
              <Chip
                label="Öne Çıkan"
                size="small"
                sx={{
                  bgcolor: (t) => alpha("#FFD700", 0.15),
                  color: "#B8860B",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(category);
              }}
              sx={{
                flex: 1,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                height: 32,
                background: `linear-gradient(135deg, ${categoryColor}, ${darken(
                  categoryColor,
                  0.2
                )})`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${darken(
                    categoryColor,
                    0.1
                  )}, ${darken(categoryColor, 0.3)})`,
                  transform: "translateY(-1px)",
                },
              }}
            >
              Düzenle
            </Button>

            <Tooltip title="Kategoriyi Sil" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteCategoryId(category._id);
                  setConfirmDelete(true);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 3,
                  bgcolor: alpha("#f44336", 0.1),
                  color: "#f44336",
                  border: `1px solid ${alpha("#f44336", 0.2)}`,
                  "&:hover": {
                    bgcolor: alpha("#f44336", 0.2),
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={category.featured ? "Öne Çıkandan Çıkar" : "Öne Çıkar"}
              arrow
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFeatured(category);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 3,
                  bgcolor: (t) =>
                    alpha(
                      category.featured ? "#FFD700" : t.palette.action.hover,
                      0.1
                    ),
                  color: category.featured ? "#FFD700" : "text.secondary",
                  border: `1px solid ${alpha(
                    category.featured ? "#FFD700" : "rgba(0, 0, 0, 0)",
                    0.2
                  )}`,
                  "&:hover": {
                    bgcolor: (t) =>
                      alpha(
                        category.featured ? "#FFD700" : t.palette.action.hover,
                        0.2
                      ),
                  },
                }}
              >
                <StarIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </StyledCard>
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Enhanced Background */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (t) =>
            t.palette.mode === "dark"
              ? `radial-gradient(circle at 20% 15%, ${alpha(
                  t.palette.primary.main,
                  0.15
                )}, transparent 60%), 
                 radial-gradient(circle at 80% 85%, ${alpha(
                   t.palette.secondary.main,
                   0.12
                 )}, transparent 60%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.default
                })`
              : `radial-gradient(circle at 20% 15%, ${alpha(
                  t.palette.primary.light,
                  0.4
                )}, transparent 65%), 
                 radial-gradient(circle at 80% 85%, ${alpha(
                   t.palette.secondary.light,
                   0.3
                 )}, transparent 65%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.paper
                })`,
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        {/* Enhanced Header */}
        <Paper
          elevation={0}
          sx={(t) => ({
            mb: 4,
            p: 4,
            borderRadius: 6,
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
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 30% 20%, ${alpha(
                t.palette.primary.main,
                0.08
              )} 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, ${alpha(
                             t.palette.secondary.main,
                             0.06
                           )} 0%, transparent 50%)`,
              pointerEvents: "none",
            },
          })}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Title Section */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={3}
              sx={{ mb: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={(t) => ({
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                    boxShadow: `0 8px 32px ${alpha(
                      t.palette.primary.main,
                      0.3
                    )}`,
                  })}
                >
                  <CategoryIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{
                      mb: 1,
                      background: (t) =>
                        `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "rgba(0, 0, 0, 0)",
                      letterSpacing: "-1px",
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    Kategori Yönetimi
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Badge
                      badgeContent={categories.length}
                      color="primary"
                      max={999}
                    >
                      <Chip
                        icon={<CategoryIcon sx={{ fontSize: 18 }} />}
                        label="Toplam Kategori"
                        size="small"
                        sx={{
                          height: 32,
                          fontWeight: 600,
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                          color: "primary.main",
                        }}
                      />
                    </Badge>
                    <Badge
                      badgeContent={categories.filter((c) => c.featured).length}
                      color="secondary"
                      max={999}
                    >
                      <Chip
                        icon={<StarIcon sx={{ fontSize: 18 }} />}
                        label="Öne Çıkan"
                        size="small"
                        sx={{
                          height: 32,
                          fontWeight: 600,
                          bgcolor: (t) => alpha(t.palette.secondary.main, 0.15),
                          color: "secondary.main",
                        }}
                      />
                    </Badge>
                  </Stack>
                </Box>
              </Stack>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  sx={(t) => ({
                    height: CONTROL_H,
                    borderRadius: 4,
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    px: 3,
                    background: `linear-gradient(135deg, ${
                      t.palette.primary.main
                    }, ${darken(t.palette.primary.main, 0.2)})`,
                    boxShadow: `0 4px 16px ${alpha(
                      t.palette.primary.main,
                      0.3
                    )}`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 24px ${alpha(
                        t.palette.primary.main,
                        0.4
                      )}`,
                    },
                    transition: "all 0.3s ease",
                  })}
                >
                  Yeni Kategori
                </Button>

                {/* View Mode Toggle */}
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Tablo Görünümü">
                    <IconButton
                      onClick={() => setViewMode("table")}
                      sx={{
                        width: CONTROL_H,
                        height: CONTROL_H,
                        borderRadius: 2,
                        bgcolor:
                          viewMode === "table" ? "primary.main" : "transparent",
                        color: viewMode === "table" ? "white" : "text.primary",
                        border: (t) =>
                          `1px solid ${alpha(t.palette.divider, 0.2)}`,
                        "&:hover": {
                          bgcolor:
                            viewMode === "table"
                              ? "primary.dark"
                              : alpha("#000", 0.05),
                        },
                      }}
                    >
                      <ViewListIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Kart Görünümü">
                    <IconButton
                      onClick={() => setViewMode("grid")}
                      sx={{
                        width: CONTROL_H,
                        height: CONTROL_H,
                        borderRadius: 2,
                        bgcolor:
                          viewMode === "grid" ? "primary.main" : "transparent",
                        color: viewMode === "grid" ? "white" : "text.primary",
                        border: (t) =>
                          `1px solid ${alpha(t.palette.divider, 0.2)}`,
                        "&:hover": {
                          bgcolor:
                            viewMode === "grid"
                              ? "primary.dark"
                              : alpha("#000", 0.05),
                        },
                      }}
                    >
                      <ViewModuleIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Stack>

            {/* Enhanced Filters */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <TextField
                size="small"
                placeholder="Kategori adı veya açıklama ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={(t) => ({
                  flex: 1,
                  minWidth: 320,
                  "& .MuiOutlinedInput-root": {
                    height: CONTROL_H,
                    borderRadius: 4,
                    background: alpha(t.palette.background.default, 0.6),
                    backdropFilter: "blur(10px)",
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ fontSize: 22, color: "primary.main" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: query && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setQuery("")}
                        sx={{
                          bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                          color: "error.main",
                        }}
                      >
                        <ClearIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Paper
                elevation={0}
                sx={(t) => ({
                  borderRadius: 4,
                  border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
                  background: showFeaturedOnly
                    ? `linear-gradient(135deg, ${alpha(
                        "#FFD700",
                        0.15
                      )}, ${alpha("#FFA000", 0.1)})`
                    : alpha(t.palette.background.default, 0.6),
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": {
                    border: `1px solid ${alpha(
                      showFeaturedOnly ? "#FFD700" : t.palette.primary.main,
                      0.4
                    )}`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${alpha(
                      showFeaturedOnly ? "#FFD700" : t.palette.primary.main,
                      0.2
                    )}`,
                  },
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: showFeaturedOnly
                      ? "linear-gradient(90deg, #FFD700, #FFA000)"
                      : "transparent",
                    transition: "all 0.3s ease",
                  },
                })}
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor: showFeaturedOnly
                            ? "#FFD700"
                            : undefined,
                          boxShadow: showFeaturedOnly
                            ? "0 2px 8px rgba(255, 215, 0, 0.4)"
                            : undefined,
                          transition: "all 0.3s ease",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: showFeaturedOnly
                            ? alpha("#FFD700", 0.3)
                            : undefined,
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: showFeaturedOnly
                            ? "linear-gradient(135deg, #FFD700, #FFA000)"
                            : alpha("#FFD700", 0.1),
                          transition: "all 0.3s ease",
                          transform: showFeaturedOnly
                            ? "scale(1.1)"
                            : "scale(1)",
                        }}
                      >
                        <StarIcon
                          sx={{
                            fontSize: 18,
                            color: showFeaturedOnly ? "white" : "#FFD700",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={showFeaturedOnly ? 700 : 600}
                          sx={{
                            color: showFeaturedOnly
                              ? "#B8860B"
                              : "text.primary",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Sadece Öne Çıkanlar
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: showFeaturedOnly
                              ? "#B8860B"
                              : "text.secondary",
                            fontSize: "0.7rem",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {categories.filter((c) => c.featured).length} kategori
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  sx={{
                    m: 0,
                    p: 2,
                    width: "100%",
                    pointerEvents: "none", // Sadece Paper'ın onClick'ini kullan
                  }}
                />
              </Paper>

              {query && (
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    height: CONTROL_H,
                    borderRadius: 4,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                  }}
                  startIcon={<ClearIcon fontSize="small" />}
                >
                  Temizle
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>

        {/* Content Area */}
        {viewMode === "grid" ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                "& > *": {
                  flexGrow: 1,
                  flexShrink: 0,
                  flexBasis: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    lg: "calc(33.333% - 16px)",
                  },
                  minWidth: 0,
                  height: 280,
                },
              }}
            >
              {loading &&
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <Card key={i} sx={{ borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                        <Skeleton variant="circular" width={64} height={64} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="80%" height={24} />
                          <Skeleton variant="text" width="60%" height={16} />
                        </Box>
                      </Stack>
                      <Skeleton variant="text" width="100%" height={16} />
                      <Skeleton variant="text" width="70%" height={16} />
                      <Box sx={{ mt: "auto", pt: 3, display: "flex", gap: 1 }}>
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={24}
                          sx={{ borderRadius: 1 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={70}
                          height={24}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}

              {!loading && paginatedCategories.length === 0 && (
                <Box sx={{ width: "100%" }}>
                  <Paper
                    sx={{
                      p: 8,
                      textAlign: "center",
                      borderRadius: 4,
                      border: (t) =>
                        `1px dashed ${alpha(t.palette.divider, 0.3)}`,
                      bgcolor: (t) => alpha(t.palette.background.default, 0.3),
                    }}
                  >
                    <CategoryIcon
                      sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mb: 1 }}
                    >
                      {query || showFeaturedOnly
                        ? "Kategori bulunamadı"
                        : "Henüz kategori yok"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {query || showFeaturedOnly
                        ? "Aradığınız kriterlere uygun kategori bulunamadı"
                        : "İlk kategorinizi oluşturun"}
                    </Typography>
                    {query || showFeaturedOnly ? (
                      <Button
                        variant="outlined"
                        onClick={clearFilters}
                        startIcon={<ClearIcon />}
                      >
                        Filtreleri Temizle
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={openCreateDialog}
                        startIcon={<AddIcon />}
                      >
                        Yeni Kategori
                      </Button>
                    )}
                  </Paper>
                </Box>
              )}

              {!loading &&
                paginatedCategories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
            </Box>

            {/* Grid Pagination */}
            {!loading && filtered.length > 0 && totalPages > 1 && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 2,
                    borderRadius: 4,
                    backdrop: "blur(10px)",
                    background: (t) => alpha(t.palette.background.paper, 0.9),
                    border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Sayfa {currentPage} / {totalPages} • {filtered.length}{" "}
                      kategori
                    </Typography>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, value) => setCurrentPage(value)}
                      color="primary"
                      shape="rounded"
                      size="small"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                          fontSize: 12,
                          fontWeight: 600,
                          height: 32,
                          minWidth: 32,
                          border: (t) =>
                            `1px solid ${alpha(t.palette.divider, 0.2)}`,
                          "&:hover": {
                            transform: "translateY(-1px)",
                          },
                          "&.Mui-selected": {
                            fontWeight: 700,
                            transform: "translateY(-1px)",
                          },
                        },
                      }}
                    />
                  </Stack>
                </Paper>
              </Box>
            )}
          </>
        ) : (
          // Table View
          <Paper
            elevation={0}
            sx={(t) => ({
              borderRadius: 4,
              backdropFilter: "blur(20px)",
              background: alpha(t.palette.background.paper, 0.9),
              border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
              overflow: "hidden",
            })}
          >
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        bgcolor: (t) =>
                          alpha(t.palette.background.default, 0.5),
                        width: 80,
                      }}
                    >
                      İkon
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        bgcolor: (t) =>
                          alpha(t.palette.background.default, 0.5),
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": {
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                        },
                      }}
                      onClick={handleNameSort}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="inherit" fontWeight={700}>
                          Kategori Adı
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <ImportExportIcon
                            sx={{
                              fontSize: 16,
                              color:
                                nameSort === "asc"
                                  ? "primary.main"
                                  : "text.disabled",
                              transform:
                                nameSort === "desc" ? "rotate(180deg)" : "none",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        bgcolor: (t) =>
                          alpha(t.palette.background.default, 0.5),
                      }}
                    >
                      Açıklama
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        bgcolor: (t) =>
                          alpha(t.palette.background.default, 0.5),
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": {
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                        },
                      }}
                      onClick={(e) => setStatusAnchorEl(e.currentTarget)}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="inherit" fontWeight={700}>
                          Durum
                        </Typography>
                        <FilterListIcon
                          sx={{
                            fontSize: 16,
                            color: statusFilter
                              ? "primary.main"
                              : "text.disabled",
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        bgcolor: (t) =>
                          alpha(t.palette.background.default, 0.5),
                        width: 120,
                      }}
                    >
                      İşlemler
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading &&
                    Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        <TableCell>
                          <Skeleton variant="circular" width={40} height={40} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width="70%" height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width="90%" height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} height={24} />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Skeleton
                              variant="circular"
                              width={36}
                              height={36}
                            />
                            <Skeleton
                              variant="circular"
                              width={36}
                              height={36}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                  {!loading && paginatedCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 8 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            alignItems: "center",
                            opacity: 0.75,
                          }}
                        >
                          <CategoryIcon
                            sx={{ fontSize: 64 }}
                            color="disabled"
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            Kategori bulunamadı
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aradığınız kriterlere uygun kategori bulunamadı
                          </Typography>
                          {(query ||
                            showFeaturedOnly ||
                            statusFilter ||
                            nameSort) && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={clearFilters}
                              startIcon={<ClearIcon />}
                            >
                              Filtreleri Temizle
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    paginatedCategories.map((category) => {
                      const categoryColor = getCategoryColor(category.color);
                      const IconComponent = getIconComponent(category.icon);

                      return (
                        <TableRow
                          key={category._id}
                          hover
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: (t) =>
                                alpha(categoryColor, 0.05),
                              "& .action-buttons": {
                                opacity: 1,
                                transform: "translateX(0)",
                              },
                            },
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: categoryColor,
                                boxShadow: `0 4px 12px ${alpha(
                                  categoryColor,
                                  0.3
                                )}`,
                              }}
                            >
                              <IconComponent
                                sx={{ fontSize: 20, color: "white" }}
                              />
                            </Avatar>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Stack spacing={0.5}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography variant="body2" fontWeight={600}>
                                  {category.name}
                                </Typography>
                                {category.parent && (
                                  <Chip
                                    icon={
                                      <AccountTreeIcon sx={{ fontSize: 12 }} />
                                    }
                                    label="Alt"
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.65rem",
                                      bgcolor: alpha(categoryColor, 0.1),
                                      color: darken(categoryColor, 0.3),
                                      fontWeight: 600,
                                      "& .MuiChip-icon": {
                                        marginLeft: "4px",
                                        marginRight: "-2px",
                                      },
                                    }}
                                  />
                                )}
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {`${getPostCount(category)} yazı`}
                                {category.parent && (
                                  <>
                                    {" • "}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        color: "primary.main",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {categories.find(
                                        (c) => c._id === category.parent
                                      )?.name || "Bilinmeyen Parent"}
                                    </Typography>
                                    {" kategorisinin alt kategorisi"}
                                  </>
                                )}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {category.description || "Açıklama bulunmuyor"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" spacing={1}>
                              {category.featured && (
                                <Chip
                                  icon={<StarIcon sx={{ fontSize: 16 }} />}
                                  label="Öne Çıkan"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha("#FFD700", 0.2),
                                    color: "#B8860B",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                              {category.parent && (
                                <Chip
                                  icon={
                                    <AccountTreeIcon sx={{ fontSize: 16 }} />
                                  }
                                  label="Alt Kategori"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(categoryColor, 0.1),
                                    color: darken(categoryColor, 0.3),
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                              className="action-buttons"
                              sx={{
                                opacity: 0.7,
                                transform: "translateX(10px)",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Tooltip title="Düzenle" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(category)}
                                  sx={(t) => ({
                                    width: 36,
                                    height: 36,
                                    borderRadius: 3,
                                    color: "primary.main",
                                    bgcolor: alpha(t.palette.primary.main, 0.1),
                                    border: `1px solid ${alpha(
                                      t.palette.primary.main,
                                      0.2
                                    )}`,
                                    "&:hover": {
                                      bgcolor: alpha(
                                        t.palette.primary.main,
                                        0.2
                                      ),
                                      transform: "scale(1.0)",
                                    },
                                  })}
                                >
                                  <EditIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Sil" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDeleteCategoryId(category._id);
                                    setConfirmDelete(true);
                                  }}
                                  sx={(t) => ({
                                    width: 36,
                                    height: 36,
                                    borderRadius: 3,
                                    color: "error.main",
                                    bgcolor: alpha(t.palette.error.main, 0.1),
                                    border: `1px solid ${alpha(
                                      t.palette.error.main,
                                      0.2
                                    )}`,
                                    "&:hover": {
                                      bgcolor: alpha(t.palette.error.main, 0.2),
                                      transform: "scale(1.0)",
                                    },
                                  })}
                                >
                                  <DeleteIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Table Footer with Pagination */}
            {!loading && filtered.length > 0 && (
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: (t) =>
                    `1px solid ${alpha(t.palette.divider, 0.1)}`,
                  bgcolor: (t) => alpha(t.palette.background.default, 0.3),
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight={600}
                  >
                    Toplam {filtered.length} kategori
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sayfa {currentPage} / {totalPages}
                  </Typography>
                </Stack>

                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    color="primary"
                    shape="rounded"
                    size="small"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        height: 32,
                        minWidth: 32,
                        border: (t) =>
                          `1px solid ${alpha(t.palette.divider, 0.2)}`,
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                        "&.Mui-selected": {
                          fontWeight: 700,
                          transform: "translateY(-1px)",
                        },
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Paper>
        )}

        {/* Status Filter Menu */}
        <Menu
          anchorEl={statusAnchorEl}
          open={Boolean(statusAnchorEl)}
          onClose={() => setStatusAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              mt: 1,
              boxShadow: (t) =>
                `0 8px 32px ${alpha(t.palette.primary.main, 0.15)}`,
              border: (t) => `1px solid ${alpha(t.palette.divider, 0.1)}`,
            },
          }}
        >
          <MenuItem
            onClick={() => handleStatusFilter("")}
            selected={statusFilter === ""}
          >
            <ListItemIcon>
              <ClearIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tümü</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusFilter("featured")}
            selected={statusFilter === "featured"}
          >
            <ListItemIcon>
              <StarIcon fontSize="small" sx={{ color: "#FFD700" }} />
            </ListItemIcon>
            <ListItemText>Sadece Öne Çıkanlar</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusFilter("subcategory")}
            selected={statusFilter === "subcategory"}
          >
            <ListItemIcon>
              <AccountTreeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sadece Alt Kategoriler</ListItemText>
          </MenuItem>
        </Menu>

        {/* Enhanced Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          TransitionComponent={Transition}
          fullWidth
          maxWidth="sm"
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: 6,
              overflow: "hidden",
              background: (t) =>
                t.palette.mode === "dark"
                  ? `linear-gradient(145deg, ${alpha(
                      t.palette.background.paper,
                      0.95
                    )}, ${alpha(t.palette.background.default, 0.9)})`
                  : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                      "#f8fafc",
                      0.95
                    )})`,
              backdropFilter: "blur(20px)",
              maxHeight: "90vh",
              paddingTop: "8px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              pb: 1,
              pt: 3,
              px: { xs: 2, sm: 3 }, // Mobilde padding azalt
              fontSize: { xs: "1.2rem", sm: "1.4rem" }, // Mobilde font küçült
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "rgba(0, 0, 0, 0)",
            }}
          >
            {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
          </DialogTitle>

          <DialogContent
            sx={{
              pt: 3,
              px: { xs: 2, sm: 3 }, // Mobilde padding azalt
              pb: 1,
            }}
          >
            <Stack spacing={3}>
              {/* Kategori Adı */}
              <TextField
                label="Kategori Adı"
                fullWidth
                value={categoryInput.name}
                onChange={(e) =>
                  setCategoryInput({ ...categoryInput, name: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    height: { xs: 48, sm: 56 }, // Mobilde daha küçük
                  },
                }}
              />

              {/* Açıklama */}
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={3}
                value={categoryInput.description}
                onChange={(e) =>
                  setCategoryInput({
                    ...categoryInput,
                    description: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
                      <DescriptionIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              {/* Renk Seçimi */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PaletteIcon sx={{ fontSize: 18 }} />
                  Renk Seçin
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(8, 1fr)", // Mobilde 8 kolon
                      sm: "repeat(10, 1fr)", // Desktop'ta 10 kolon
                    },
                    gap: { xs: 0.8, sm: 1 }, // Mobilde gap azalt
                    p: { xs: 1.5, sm: 2 }, // Mobilde padding azalt
                    border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
                    borderRadius: 3,
                    bgcolor: (t) => alpha(t.palette.background.default, 0.3),
                  }}
                >
                  {PRESET_COLORS.map((color) => (
                    <ColorPickerButton
                      key={color}
                      color={color}
                      selected={categoryInput.color === color}
                      onClick={() =>
                        setCategoryInput({ ...categoryInput, color })
                      }
                      sx={{
                        width: { xs: 32, sm: 40 }, // Mobilde küçült
                        height: { xs: 32, sm: 40 }, // Mobilde küçült
                      }}
                    />
                  ))}
                </Box>
                <TextField
                  label="Özel Renk (Hex)"
                  size="small"
                  fullWidth
                  value={categoryInput.color}
                  onChange={(e) =>
                    setCategoryInput({
                      ...categoryInput,
                      color: e.target.value,
                    })
                  }
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: { xs: 40, sm: 48 }, // Mobilde küçült
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: { xs: 16, sm: 20 },
                            height: { xs: 16, sm: 20 },
                            borderRadius: "50%",
                            bgcolor: categoryInput.color,
                            border: "1px solid #ccc",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* İkon Seçimi */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 18 }} />
                  İkon Seçin
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(5, 1fr)", // Mobilde 5 kolon
                      sm: "repeat(6, 1fr)", // Desktop'ta 6 kolon
                      md: "repeat(7, 1fr)", // Büyük ekranlarda 7 kolon
                    },
                    gap: { xs: 1, sm: 1.5 }, // Mobilde gap azalt
                    p: { xs: 1.5, sm: 2 }, // Mobilde padding azalt
                    border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
                    borderRadius: 3,
                    bgcolor: (t) => alpha(t.palette.background.default, 0.3),
                    maxHeight: { xs: 200, sm: 220 }, // Mobilde daha düşük
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: alpha("#000", 0.1),
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha("#000", 0.3),
                      borderRadius: 3,
                    },
                  }}
                >
                  {AVAILABLE_ICONS.map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <Tooltip
                        key={iconData.name}
                        title={iconData.label}
                        arrow
                        placement="top"
                      >
                        <IconPickerButton
                          selected={categoryInput.icon === iconData.name}
                          onClick={() =>
                            setCategoryInput({
                              ...categoryInput,
                              icon: iconData.name,
                            })
                          }
                        >
                          <IconComponent
                            sx={{
                              fontSize: { xs: 20, sm: 24 }, // Mobilde küçült
                              color:
                                categoryInput.icon === iconData.name
                                  ? "primary.main"
                                  : "text.secondary",
                            }}
                          />
                        </IconPickerButton>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>

              {/* Parent Kategori */}
              <TextField
                select
                label="Parent Kategori"
                fullWidth
                value={categoryInput.parent}
                onChange={(e) =>
                  setCategoryInput({
                    ...categoryInput,
                    parent: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountTreeIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    height: { xs: 48, sm: 56 }, // Mobilde küçült
                  },
                }}
              >
                <MenuItem value="">(Ana Kategori)</MenuItem>
                {categories
                  .filter((c) =>
                    editingCategory ? c._id !== editingCategory._id : true
                  )
                  .map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: c.color || "#999",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.name}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
              </TextField>

              {/* Öne Çıkan Switch */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                  border: (t) =>
                    `1px solid ${alpha(t.palette.primary.main, 0.1)}`,
                }}
              >
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
                      sx={{
                        "& .MuiSwitch-thumb": {
                          boxShadow: (t) =>
                            `0 2px 8px ${alpha(t.palette.primary.main, 0.3)}`,
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <StarIcon sx={{ fontSize: 18, color: "#FFD700" }} />
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
                        >
                          Öne Çıkan Kategori
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          Sidebar'da öne çıkan olarak gösterilir
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  sx={{ m: 0 }}
                />
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              p: { xs: 2, sm: 3 },
              pt: 2,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" }, // Mobilde dikey
            }}
          >
            <Button
              onClick={() => setOpenDialog(false)}
              fullWidth={window.innerWidth < 600} // Mobilde full width
              sx={{
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
                height: { xs: 44, sm: 40 },
                order: { xs: 2, sm: 1 }, // Mobilde sıralama değiştir
              }}
            >
              İptal Et
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              fullWidth={window.innerWidth < 600} // Mobilde full width
              sx={(t) => ({
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                height: { xs: 44, sm: 40 },
                order: { xs: 1, sm: 2 }, // Mobilde sıralama değiştir
                background: `linear-gradient(135deg, ${
                  t.palette.primary.main
                }, ${darken(t.palette.primary.main, 0.2)})`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(t.palette.primary.main, 0.4)}`,
                },
              })}
            >
              {editingCategory ? "Güncelle" : "Ekle"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Delete Confirmation */}
        <Dialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              borderRadius: 6,
              overflow: "hidden",
              background: (t) =>
                t.palette.mode === "dark"
                  ? `linear-gradient(145deg, ${alpha(
                      t.palette.background.paper,
                      0.95
                    )}, ${alpha(t.palette.background.default, 0.9)})`
                  : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                      "#f8fafc",
                      0.95
                    )})`,
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              pb: 1,
              fontSize: "1.3rem",
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.error.main}, ${darken(
                  t.palette.error.main,
                  0.2
                )})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "rgba(0, 0, 0, 0)",
            }}
          >
            Kategoriyi Kalıcı Olarak Sil
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1 }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                  border: (t) =>
                    `1px solid ${alpha(t.palette.error.main, 0.2)}`,
                }}
              >
                <Typography fontSize={14} fontWeight={600} color="error.main">
                  ⚠️ Bu işlem geri alınamaz!
                </Typography>
              </Box>
              <Typography fontSize={14} color="text.secondary" lineHeight={1.6}>
                Kategori ve tüm ilişkili veriler kalıcı olarak silinecektir. Bu
                kategoriye ait yazılar "Kategorisiz" olarak işaretlenecektir.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setConfirmDelete(false)}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
              }}
            >
              İptal Et
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              sx={(t) => ({
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                background: `linear-gradient(135deg, ${
                  t.palette.error.main
                }, ${darken(t.palette.error.main, 0.2)})`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(t.palette.error.main, 0.4)}`,
                },
              })}
            >
              Evet, Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* 3 Dot Menu bölümünü tamamen kaldırın */}
        {/* <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          ...
        </Menu> */}

        {/* Enhanced Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: (t) =>
                `0 8px 32px ${alpha(t.palette[snackbar.severity].main, 0.3)}`,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminCategoriesPage;
