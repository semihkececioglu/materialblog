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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import ArticleIcon from "@mui/icons-material/Article";
import dayjs from "dayjs";
import { alpha, darken } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../redux/postSlice";

const CONTROL_H = 38;
const SKELETON_ROWS = 6;

const categoryColors = {
  React: { light: "#E3F2FD", main: "#2196F3", text: "#1976D2" },
  JavaScript: { light: "#FFF3E0", main: "#FF9800", text: "#F57C00" },
  Tasarım: { light: "#FCE4EC", main: "#E91E63", text: "#C2185B" },
  Galatasaray: { light: "#F3E5F5", main: "#9C27B0", text: "#7B1FA2" },
};

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
  const postsPerPage = 10;

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
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortOption, currentPage, setSearchParams]);

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

  // Filter + sort
  const filtered = useMemo(() => {
    let f = [...allPosts];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      f = f.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (selectedCategory) f = f.filter((p) => p.category === selectedCategory);
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
            px: 0.4,
            borderRadius: 0.5,
            bgcolor: "warning.main",
            color: "warning.contrastText",
            fontWeight: 600,
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

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 4, md: 5 }, position: "relative" }}
    >
      {/* Ambient unified background */}
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
                  0.18
                )}, transparent 60%), linear-gradient(135deg, ${
                  t.palette.background.default
                }, ${t.palette.background.default})`
              : `radial-gradient(circle at 25% 18%, ${alpha(
                  t.palette.primary.light,
                  0.55
                )}, transparent 65%), linear-gradient(135deg, ${
                  t.palette.background.default
                }, ${t.palette.background.paper})`,
        }}
      />

      {/* HEADER */}
      <Paper
        elevation={0}
        sx={(t) => ({
          mb: 4,
          p: 3,
          pt: 2.6,
          pb: 2.2,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 1.4,
          backdropFilter: "blur(18px)",
          background: alpha(t.palette.background.paper, 0.85),
          border: `1px solid ${alpha(t.palette.divider, 0.3)}`,
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(120deg, ${alpha(
              t.palette.primary.main,
              0.09
            )}, transparent 60%)`,
            pointerEvents: "none",
          },
        })}
      >
        {/* Title Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={(t) => ({
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: alpha(t.palette.primary.main, 0.15),
              border: `1px solid ${alpha(t.palette.primary.main, 0.25)}`,
              flexShrink: 0,
            })}
          >
            <ArticleIcon color="primary" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 260 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                lineHeight: 1.08,
              }}
            >
              Yazılar
            </Typography>
            <Box sx={{ mt: 0.6, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                size="small"
                icon={<ArticleIcon sx={{ fontSize: 18 }} />}
                label={`${allPosts.length} Toplam`}
                sx={{
                  height: 30,
                  fontWeight: 600,
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                  color: "primary.main",
                  ".MuiChip-label": { px: 1.2 },
                }}
              />
              <Chip
                size="small"
                label={`${filtered.length} Filtrelenen`}
                sx={{
                  height: 30,
                  fontWeight: 600,
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.08),
                  ".MuiChip-label": { px: 1.2 },
                }}
              />
            </Box>
          </Box>

          {(user?.role === "admin" || user?.role === "editor") && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/editor")}
              sx={(t) => ({
                height: CONTROL_H,
                borderRadius: 3,
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                px: 2.6,
                background: `linear-gradient(90deg, ${
                  t.palette.primary.main
                }, ${darken(t.palette.primary.main, 0.12)})`,
              })}
            >
              Yeni Yazı
            </Button>
          )}
        </Box>

        {/* Filters Row */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.4,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Başlık ara"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            sx={(t) => ({
              minWidth: { xs: "100%", sm: 260 },
              "& .MuiOutlinedInput-root": {
                height: CONTROL_H,
                borderRadius: 3,
                background: alpha(t.palette.background.default, 0.5),
                "&:hover": {
                  background: alpha(t.palette.background.default, 0.65),
                },
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
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
                  >
                    ✕
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
              minWidth: 180,
              "& .MuiOutlinedInput-root": {
                height: CONTROL_H,
                borderRadius: 3,
                background: alpha(t.palette.background.default, 0.5),
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">Tüm Kategoriler</MenuItem>
            {Object.entries(categoryColors).map(([cat, colors]) => (
              <MenuItem key={cat} value={cat}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: colors.main,
                    }}
                  />
                  <Typography variant="body2">{cat}</Typography>
                </Box>
              </MenuItem>
            ))}
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
              minWidth: 160,
              "& .MuiOutlinedInput-root": {
                height: CONTROL_H,
                borderRadius: 3,
                background: alpha(t.palette.background.default, 0.5),
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TuneIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="newest">En Yeni</MenuItem>
            <MenuItem value="oldest">En Eski</MenuItem>
            <MenuItem value="title-asc">Başlık A-Z</MenuItem>
            <MenuItem value="title-desc">Başlık Z-A</MenuItem>
          </TextField>

          {(searchTerm || selectedCategory || sortOption !== "newest") && (
            <Button
              size="small"
              variant="text"
              onClick={clearFilters}
              sx={{
                height: CONTROL_H,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
              }}
              startIcon={<FilterListIcon fontSize="small" />}
            >
              Temizle
            </Button>
          )}
        </Box>
      </Paper>

      {/* TABLE CARD */}
      <Paper
        elevation={0}
        sx={(t) => ({
          borderRadius: 4,
          backdropFilter: "blur(14px)",
          background: alpha(t.palette.background.paper, 0.85),
          border: `1px solid ${alpha(t.palette.divider, 0.3)}`,
          overflow: "hidden",
        })}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 90 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Başlık</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 160 }}>
                  Kategori
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 140 }}>
                  Tarih
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, width: 140 }}>
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell sx={{ py: 1.6 }}>
                      <Skeleton width={56} height={24} />
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Skeleton width="60%" height={20} />
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Skeleton width={110} height={26} />
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Skeleton width={90} height={20} />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.6 }}>
                      <Skeleton width={74} height={32} />
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
                        gap: 1.8,
                        alignItems: "center",
                        opacity: 0.75,
                      }}
                    >
                      <ArticleIcon sx={{ fontSize: 54 }} color="disabled" />
                      <Typography variant="body2" color="text.secondary">
                        Kriterlere uygun yazı bulunamadı.
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
                        >
                          Filtreleri sıfırla
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                visiblePosts.map((post) => (
                  <TableRow
                    key={post._id}
                    hover
                    sx={{
                      transition: ".25s",
                      "&:hover": {
                        backgroundColor: (t) =>
                          alpha(t.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <TableCell sx={{ py: 1.6 }}>
                      <Typography
                        sx={{
                          fontSize: ".72rem",
                          color: "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        {post._id.slice(-6)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.6, maxWidth: 460 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: ".9rem",
                          lineHeight: 1.25,
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
                    <TableCell sx={{ py: 1.6 }}>
                      <Chip
                        label={post.category || "—"}
                        size="small"
                        sx={{
                          height: 30,
                          fontWeight: 600,
                          bgcolor:
                            categoryColors[post.category]?.light ||
                            "action.hover",
                          color:
                            categoryColors[post.category]?.text ||
                            "text.secondary",
                          ".MuiChip-label": { px: 1.1, fontSize: 12 },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: ".7rem",
                          fontWeight: 500,
                        }}
                      >
                        {post.date && dayjs(post.date).isValid()
                          ? dayjs(post.date).format("DD.MM.YYYY")
                          : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.6 }}>
                      {user?.role === "admin" && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip title="Düzenle" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(post)}
                              sx={(t) => ({
                                width: 36,
                                height: 36,
                                borderRadius: 3,
                                color: "primary.main",
                                bgcolor: alpha(t.palette.primary.main, 0.12),
                                "&:hover": {
                                  bgcolor: alpha(t.palette.primary.main, 0.22),
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
                                bgcolor: alpha(t.palette.error.main, 0.12),
                                "&:hover": {
                                  bgcolor: alpha(t.palette.error.main, 0.2),
                                },
                              })}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>

        {/* Footer (pagination summary) */}
        {!loading && filtered.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 2.4,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Toplam {filtered.length} yazı
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Sayfa {currentPage} / {totalPages}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 500,
                "&.Mui-selected": { fontWeight: 700 },
              },
            }}
          />
        </Box>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: "100%",
            maxWidth: 420,
            p: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Yazıyı Sil</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography fontSize={13}>
            Bu yazı kalıcı olarak silinecek. Devam?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setConfirmDelete(false)}
            sx={{ textTransform: "none", borderRadius: 3 }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={(t) => ({
              textTransform: "none",
              borderRadius: 3,
              fontWeight: 600,
              background: `linear-gradient(90deg, ${
                t.palette.error.main
              }, ${darken(t.palette.error.main, 0.18)})`,
            })}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </Container>
  );
};

export default PostsPage;
