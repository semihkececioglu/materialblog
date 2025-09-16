import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Slide,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
  Container,
  Tooltip,
  Skeleton,
  Stack,
  Card,
  CardContent,
  Avatar,
  Badge,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingUpIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ImportExport as ImportExportIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import TuneIcon from "@mui/icons-material/Tune";
import ArticleIcon from "@mui/icons-material/Article";
import dayjs from "dayjs";
import { alpha, darken } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../redux/postSlice";

const CONTROL_H = 42;
const SKELETON_ROWS = 8;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { posts: allPosts = [], loading: loadingFromStore } = useSelector(
    (s) => s.posts || {}
  );
  const user = useSelector((s) => s.user.currentUser);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "newest"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [viewMode, setViewMode] = useState(searchParams.get("view") || "table");
  const postsPerPage = viewMode === "grid" ? 12 : 10;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (sortOption) params.sort = sortOption;
    if (currentPage > 1) params.page = currentPage;
    if (viewMode !== "table") params.view = viewMode;
    setSearchParams(params);
  }, [
    searchTerm,
    selectedCategory,
    sortOption,
    currentPage,
    viewMode,
    setSearchParams,
  ]);

  const showSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePost(postToDelete)).unwrap();
      dispatch(fetchPosts({ page: 1, limit: 1000 }));
      showSnackbar("Yazı silindi", "info");
    } catch {
      showSnackbar("Silme başarısız", "error");
    } finally {
      setConfirmDelete(false);
      setPostToDelete(null);
    }
  };

  const handleEdit = (post) => navigate(`/admin/posts/edit/${post._id}`);
  const handleView = (post) => window.open(`/post/${post.slug}`, "_blank");

  // Filter + sort
  const filtered = useMemo(() => {
    let f = [...allPosts];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      f = f.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory)
      f = f.filter((p) => p.category?.name === selectedCategory);
    switch (sortOption) {
      case "title-asc":
        f.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        f.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "oldest":
        f.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
        break;
      default:
        f.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }
    return f;
  }, [allPosts, searchTerm, selectedCategory, sortOption]);

  const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
  const visiblePosts = filtered.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const loading = loadingFromStore && !allPosts.length;

  const highlight = (text = "") => {
    if (!searchTerm.trim()) return text;
    const q = searchTerm.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <Box
          component="mark"
          sx={{
            px: 0.5,
            py: 0.2,
            borderRadius: 1,
            bgcolor: "warning.main",
            color: "warning.contrastText",
            fontWeight: 700,
            fontSize: "0.9em",
          }}
        >
          {text.slice(idx, idx + q.length)}
        </Box>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("newest");
    setCurrentPage(1);
  };

  const getUniqueCategories = () => {
    const categories = allPosts
      .map((post) => post.category?.name)
      .filter(Boolean);
    return [...new Set(categories)];
  };

  // Generate category color based on category name
  const getCategoryColor = (categoryName) => {
    if (!categoryName)
      return {
        light: alpha("#666", 0.1),
        main: "#666",
        text: "#333",
      };

    // Generate consistent color based on category name
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 65;
    const lightness = 55;

    const main = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const light = `hsl(${hue}, ${saturation - 20}%, ${lightness + 35}%)`;
    const text = `hsl(${hue}, ${saturation + 10}%, ${lightness - 20}%)`;

    return { light, main, text };
  };

  // Grid Card Component
  const PostCard = ({ post, index }) => {
    const categoryColor = getCategoryColor(post.category?.name);

    return (
      <Grow in timeout={300 + index * 100}>
        <Card
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: 4,
            border: `1px solid ${alpha("#000", 0.06)}`,
            background: (t) =>
              t.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    t.palette.background.paper,
                    0.95
                  )}, ${alpha(t.palette.background.default, 0.8)})`
                : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                    "#f8fafc",
                    0.95
                  )})`,
            backdropFilter: "blur(20px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-8px) scale(1.00)",
              boxShadow: `0 16px 40px ${alpha(categoryColor.main, 0.2)}`,
              border: `1px solid ${alpha(categoryColor.main, 0.3)}`,
              "& .post-actions": {
                opacity: 1,
                transform: "translateY(0)",
              },
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
                categoryColor.main
              }, ${alpha(categoryColor.main, 0.7)})`,
              transform: "translateX(-100%)",
              transition: "transform 0.4s ease",
            },
          }}
          onClick={() => handleView(post)}
        >
          <CardContent
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{ mb: 2 }}
            >
              <Avatar
                variant="rounded"
                src={post.image}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(categoryColor.main, 0.1),
                  border: `2px solid ${alpha(categoryColor.main, 0.2)}`,
                  flexShrink: 0,
                }}
              >
                <ArticleIcon sx={{ fontSize: 24, color: categoryColor.main }} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.3,
                    fontSize: "1.1rem",
                  }}
                >
                  {highlight(post.title)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                >
                  ID: {post._id.slice(-6)}
                </Typography>
              </Box>
            </Stack>

            {/* Content Preview */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.5,
              }}
            >
              {post.summary ||
                post.content?.substring(0, 150) + "..." ||
                "İçerik önizlemesi bulunmuyor..."}
            </Typography>

            {/* Footer */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={post.category?.name || "Kategorisiz"}
                  size="small"
                  sx={{
                    height: 28,
                    fontWeight: 600,
                    bgcolor: categoryColor.light,
                    color: categoryColor.text,
                    fontSize: "0.75rem",
                    "& .MuiChip-label": { px: 1.2 },
                  }}
                />
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTimeIcon
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize="0.7rem"
                  >
                    {post.date && dayjs(post.date).isValid()
                      ? dayjs(post.date).format("DD.MM.YY")
                      : "—"}
                  </Typography>
                </Stack>
              </Stack>

              {/* Actions */}
              <Box
                className="post-actions"
                sx={{
                  opacity: 0,
                  transform: "translateY(10px)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <Tooltip title="Görüntüle" placement="top">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(post);
                    }}
                    sx={{
                      bgcolor: alpha(categoryColor.main, 0.1),
                      color: categoryColor.main,
                      width: 32,
                      height: 32,
                      "&:hover": {
                        bgcolor: alpha(categoryColor.main, 0.2),
                        transform: "scale(1.0)",
                      },
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                {user?.role === "admin" && (
                  <>
                    <Tooltip title="Düzenle" placement="top">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                        sx={{
                          bgcolor: alpha("#2196F3", 0.1),
                          color: "#2196F3",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            bgcolor: alpha("#2196F3", 0.2),
                            transform: "scale(1.0)",
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil" placement="top">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPostToDelete(post._id);
                          setConfirmDelete(true);
                        }}
                        sx={{
                          bgcolor: alpha("#f44336", 0.1),
                          color: "#f44336",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            bgcolor: alpha("#f44336", 0.2),
                            transform: "scale(1.0)",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grow>
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 4, md: 5 }, position: "relative" }}
    >
      {/* Enhanced Background */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (t) =>
            t.palette.mode === "dark"
              ? `radial-gradient(circle at 25% 18%, ${alpha(
                  t.palette.primary.main,
                  0.15
                )}, transparent 60%), 
                 radial-gradient(circle at 75% 80%, ${alpha(
                   t.palette.secondary.main,
                   0.12
                 )}, transparent 60%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.default
                })`
              : `radial-gradient(circle at 25% 18%, ${alpha(
                  t.palette.primary.light,
                  0.4
                )}, transparent 65%), 
                 radial-gradient(circle at 75% 80%, ${alpha(
                   t.palette.secondary.light,
                   0.3
                 )}, transparent 65%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.paper
                })`,
        }}
      />

      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={(t) => ({
          mb: 4,
          p: 4,
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
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
                  boxShadow: `0 8px 32px ${alpha(t.palette.primary.main, 0.3)}`,
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: -2,
                    borderRadius: "inherit",
                    padding: 2,
                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    WebkitMaskComposite: "xor",
                    opacity: 0.3,
                  },
                })}
              >
                <ArticleIcon sx={{ fontSize: 32, color: "white" }} />
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
                    color: "transparent",
                    letterSpacing: "-1px",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Yazı Yönetimi
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Badge
                    badgeContent={allPosts.length}
                    color="primary"
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        height: 20,
                        minWidth: 20,
                      },
                    }}
                  >
                    <Chip
                      icon={<ArticleIcon sx={{ fontSize: 18 }} />}
                      label="Toplam Yazı"
                      size="small"
                      sx={{
                        height: 32,
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                        color: "primary.main",
                        "& .MuiChip-label": { px: 1.5 },
                      }}
                    />
                  </Badge>
                  <Badge
                    badgeContent={filtered.length}
                    color="secondary"
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        height: 20,
                        minWidth: 20,
                      },
                    }}
                  >
                    <Chip
                      icon={<FilterListIcon sx={{ fontSize: 18 }} />}
                      label="Filtrelenen"
                      size="small"
                      sx={{
                        height: 32,
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.secondary.main, 0.15),
                        color: "secondary.main",
                        "& .MuiChip-label": { px: 1.5 },
                      }}
                    />
                  </Badge>
                  <Chip
                    icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                    label={`${getUniqueCategories().length} Kategori`}
                    size="small"
                    sx={{
                      height: 32,
                      fontWeight: 600,
                      bgcolor: (t) => alpha(t.palette.info.main, 0.15),
                      color: "info.main",
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              {(user?.role === "admin" || user?.role === "editor") && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/admin/editor")}
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
                  Yeni Yazı
                </Button>
              )}

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
              placeholder="Başlık, içerik veya özet'te ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              sx={(t) => ({
                flex: 1,
                minWidth: 320,
                "& .MuiOutlinedInput-root": {
                  height: CONTROL_H,
                  borderRadius: 4,
                  background: alpha(t.palette.background.default, 0.6),
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha(t.palette.background.default, 0.8),
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-focused": {
                    background: alpha(t.palette.background.default, 0.9),
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 20px ${alpha(
                      t.palette.primary.main,
                      0.2
                    )}`,
                  },
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 22, color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      sx={{
                        bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                        color: "error.main",
                        "&:hover": {
                          bgcolor: (t) => alpha(t.palette.error.main, 0.2),
                        },
                      }}
                    >
                      <ClearIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              sx={(t) => ({
                minWidth: 200,
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
                    <FilterListIcon
                      sx={{ fontSize: 20, color: "secondary.main" }}
                    />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Tüm Kategoriler</MenuItem>
              {getUniqueCategories().map((cat) => {
                const colors = getCategoryColor(cat);
                return (
                  <MenuItem key={cat} value={cat}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: colors.main,
                          boxShadow: `0 2px 8px ${alpha(colors.main, 0.3)}`,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {cat}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </TextField>

            <TextField
              select
              size="small"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              sx={(t) => ({
                minWidth: 180,
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
                    <SortIcon sx={{ fontSize: 20, color: "info.main" }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="newest">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarIcon sx={{ fontSize: 16 }} />
                  <Typography>En Yeni</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="oldest">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarIcon sx={{ fontSize: 16 }} />
                  <Typography>En Eski</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="title-asc">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ImportExportIcon sx={{ fontSize: 16 }} />
                  <Typography>Başlık A-Z</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="title-desc">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ImportExportIcon
                    sx={{ fontSize: 16, transform: "rotate(180deg)" }}
                  />
                  <Typography>Başlık Z-A</Typography>
                </Stack>
              </MenuItem>
            </TextField>

            {(searchTerm || selectedCategory || sortOption !== "newest") && (
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{
                  height: CONTROL_H,
                  borderRadius: 4,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
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
        </Box>
      </Paper>

      {/* Content Area */}
      {viewMode === "grid" ? (
        // Grid View
        <Box>
          {loading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} sx={{ height: 280, borderRadius: 4 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Skeleton variant="rounded" width={56} height={56} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                    </Stack>
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="90%" height={16} />
                    <Skeleton variant="text" width="70%" height={16} />
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={28}
                        sx={{ borderRadius: 2 }}
                      />
                      <Skeleton variant="text" width={60} height={16} />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : !visiblePosts.length ? (
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 4,
                border: (t) => `1px dashed ${alpha(t.palette.divider, 0.3)}`,
                bgcolor: (t) => alpha(t.palette.background.default, 0.3),
              }}
            >
              <ArticleIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Yazı bulunamadı
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Aradığınız kriterlere uygun yazı bulunamadı
              </Typography>
              {(searchTerm || selectedCategory) && (
                <Button
                  variant="outlined"
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
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {visiblePosts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
              ))}
            </Box>
          )}
        </Box>
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
          <Box sx={{ overflowX: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      width: 90,
                      bgcolor: (t) => alpha(t.palette.background.default, 0.5),
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      bgcolor: (t) => alpha(t.palette.background.default, 0.5),
                    }}
                  >
                    Başlık
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      width: 160,
                      bgcolor: (t) => alpha(t.palette.background.default, 0.5),
                    }}
                  >
                    Kategori
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      width: 140,
                      bgcolor: (t) => alpha(t.palette.background.default, 0.5),
                    }}
                  >
                    Tarih
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      width: 160,
                      bgcolor: (t) => alpha(t.palette.background.default, 0.5),
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
                      <TableCell sx={{ py: 2 }}>
                        <Skeleton width={56} height={24} />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Skeleton width="70%" height={20} />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Skeleton
                          width={110}
                          height={28}
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Skeleton width={90} height={20} />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Skeleton variant="circular" width={36} height={36} />
                          <Skeleton variant="circular" width={36} height={36} />
                          <Skeleton variant="circular" width={36} height={36} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && !visiblePosts.length && (
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
                        <ArticleIcon sx={{ fontSize: 64 }} color="disabled" />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Yazı bulunamadı
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Aradığınız kriterlere uygun yazı bulunamadı
                        </Typography>
                        {(searchTerm || selectedCategory) && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={clearFilters}
                            sx={{
                              borderRadius: 3,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
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
                  visiblePosts.map((post, index) => {
                    const categoryColor = getCategoryColor(post.category?.name);

                    return (
                      <TableRow
                        key={post._id}
                        hover
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: (t) =>
                              alpha(categoryColor.main, 0.05),
                            transform: "scale(1.0)",
                            "& .action-buttons": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={post._id.slice(-6)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              fontFamily: "monospace",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2, maxWidth: 400 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.95rem",
                              lineHeight: 1.3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {highlight(post.title)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={post.category?.name || "Kategorisiz"}
                            size="small"
                            sx={{
                              height: 32,
                              fontWeight: 600,
                              bgcolor: categoryColor.light,
                              color: categoryColor.text,
                              fontSize: "0.75rem",
                              "& .MuiChip-label": { px: 1.2 },
                              border: `1px solid ${alpha(
                                categoryColor.main,
                                0.2
                              )}`,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <CalendarIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              {post.date && dayjs(post.date).isValid()
                                ? dayjs(post.date).format("DD.MM.YYYY")
                                : "—"}
                            </Typography>
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
                            <Tooltip title="Görüntüle" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleView(post)}
                                sx={(t) => ({
                                  width: 36,
                                  height: 36,
                                  borderRadius: 3,
                                  color: "info.main",
                                  bgcolor: alpha(t.palette.info.main, 0.1),
                                  border: `1px solid ${alpha(
                                    t.palette.info.main,
                                    0.2
                                  )}`,
                                  "&:hover": {
                                    bgcolor: alpha(t.palette.info.main, 0.2),
                                    transform: "scale(1.0)",
                                  },
                                })}
                              >
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            {user?.role === "admin" && (
                              <>
                                <Tooltip title="Düzenle" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(post)}
                                    sx={(t) => ({
                                      width: 36,
                                      height: 36,
                                      borderRadius: 3,
                                      color: "primary.main",
                                      bgcolor: alpha(
                                        t.palette.primary.main,
                                        0.1
                                      ),
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
                                      setPostToDelete(post._id);
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
                                        bgcolor: alpha(
                                          t.palette.error.main,
                                          0.2
                                        ),
                                        transform: "scale(1.0)",
                                      },
                                    })}
                                  >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>

          {/* Enhanced Footer */}
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
                borderTop: (t) => `1px solid ${alpha(t.palette.divider, 0.1)}`,
                bgcolor: (t) => alpha(t.palette.background.default, 0.3),
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={600}
                >
                  Toplam {filtered.length} yazı
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sayfa {currentPage} / {totalPages}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Sayfa başına: {postsPerPage}
                </Typography>
              </Stack>
            </Box>
          )}
        </Paper>
      )}

      {/* Enhanced Pagination */}
      {!loading && totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 3,
                fontSize: 14,
                fontWeight: 600,
                height: 40,
                minWidth: 40,
                border: (t) => `1px solid ${alpha(t.palette.divider, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    `0 4px 12px ${alpha(t.palette.primary.main, 0.2)}`,
                },
                "&.Mui-selected": {
                  fontWeight: 700,
                  background: (t) =>
                    `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                  color: "white",
                  border: "none",
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    `0 6px 20px ${alpha(t.palette.primary.main, 0.3)}`,
                },
              },
            }}
          />
        </Box>
      )}

      {/* Enhanced Delete Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 6,
            width: "100%",
            maxWidth: 480,
            p: 0,
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
            color: "transparent",
          }}
        >
          Yazıyı Kalıcı Olarak Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                border: (t) => `1px solid ${alpha(t.palette.error.main, 0.2)}`,
              }}
            >
              <Typography fontSize={14} fontWeight={600} color="error.main">
                ⚠️ Bu işlem geri alınamaz!
              </Typography>
            </Box>
            <Typography fontSize={14} color="text.secondary" lineHeight={1.6}>
              Yazı ve tüm ilişkili veriler (yorumlar, etkileşimler vb.) kalıcı
              olarak silinecektir. Bu işlemi onaylıyor musunuz?
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
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={(t) => ({
              textTransform: "none",
              borderRadius: 3,
              fontWeight: 700,
              px: 3,
              background: `linear-gradient(135deg, ${
                t.palette.error.main
              }, ${darken(t.palette.error.main, 0.2)})`,
              boxShadow: `0 4px 16px ${alpha(t.palette.error.main, 0.3)}`,
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

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: (t) =>
              `0 8px 32px ${alpha(t.palette[snackbarSeverity].main, 0.3)}`,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostsPage;
