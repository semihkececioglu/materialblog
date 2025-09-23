import React, { useEffect, useState, useMemo } from "react";
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
  Container,
  Chip,
  Tooltip,
  Skeleton,
  InputAdornment,
  Stack,
  Badge,
  Pagination,
  Alert,
  Snackbar,
  Slide,
  Fade,
  Grow,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
  SearchRounded as SearchRoundedIcon,
  CloseRounded as CloseRoundedIcon,
  Clear as ClearIcon,
  ImportExport as ImportExportIcon,
  TrendingUp as TrendingUpIcon,
  Tag as TagIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, deleteTag } from "../redux/tagSlice";
import axios from "axios";
import { alpha, darken, styled } from "@mui/material/styles";

const CONTROL_H = 42;
const SKELETON_ROWS = 8;
const ITEMS_PER_PAGE = 10;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    "& .action-buttons": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: 28,
  borderRadius: 14,
  fontWeight: 600,
  fontSize: "0.75rem",
  transition: "all 0.3s ease",
}));

const AdminTagsPage = () => {
  const dispatch = useDispatch();
  const { items: tags = [], loading } = useSelector((state) => state.tags);

  // UI State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [nameSort, setNameSort] = useState("");

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = [...tags];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    // İsim sıralaması
    if (nameSort === "asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    } else if (nameSort === "desc") {
      result.sort((a, b) => b.name.localeCompare(a.name, "tr"));
    }

    return result;
  }, [tags, query, nameSort]);

  // Sayfalama
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedTags = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const openEditDialog = (tag) => {
    setEditingTag(tag);
    setTagInput(tag.name);
    setOpenDialog(true);
  };

  const openCreateDialog = () => {
    setEditingTag(null);
    setTagInput("");
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!tagInput.trim()) {
      showSnackbar("Etiket adı gereklidir!", "error");
      return;
    }

    setSaving(true);
    try {
      if (editingTag) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app/api/tags/${editingTag._id}`,
          { name: tagInput.trim() }
        );
        showSnackbar("Etiket başarıyla güncellendi!", "success");
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app/api/tags",
          { name: tagInput.trim() }
        );
        showSnackbar("Yeni etiket başarıyla eklendi!", "success");
      }

      await dispatch(fetchTags());
      setOpenDialog(false);
      setTagInput("");
      setEditingTag(null);
    } catch (err) {
      console.error("Etiket kaydetme hatası:", err);
      showSnackbar("İşlem sırasında bir hata oluştu!", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTag(deleteTagId));
      showSnackbar("Etiket başarıyla silindi!", "info");
      setConfirmDelete(false);
      setDeleteTagId(null);

      // Sayfa kontrolü - eğer son sayfa boş kalırsa önceki sayfaya git
      const newTotal = Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotal && newTotal > 0) {
        setCurrentPage(newTotal);
      }
    } catch (error) {
      showSnackbar("Silme işlemi sırasında bir hata oluştu!", "error");
    }
  };

  const handleNameSort = (event) => {
    event.stopPropagation();
    if (nameSort === "") {
      setNameSort("asc");
    } else if (nameSort === "asc") {
      setNameSort("desc");
    } else {
      setNameSort("");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setNameSort("");
    setCurrentPage(1);
  };

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
                  <LocalOfferIcon sx={{ fontSize: 32, color: "white" }} />
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
                    Etiket Yönetimi
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Badge badgeContent={tags.length} color="primary" max={999}>
                      <StyledChip
                        icon={<LocalOfferIcon sx={{ fontSize: 18 }} />}
                        label="Toplam Etiket"
                        sx={{
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                          color: "primary.main",
                        }}
                      />
                    </Badge>
                    {query && (
                      <Badge
                        badgeContent={filtered.length}
                        color="secondary"
                        max={999}
                      >
                        <StyledChip
                          icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                          label="Görüntülenen"
                          sx={{
                            bgcolor: (t) =>
                              alpha(t.palette.secondary.main, 0.15),
                            color: "secondary.main",
                          }}
                        />
                      </Badge>
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* Action Button */}
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
                  boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.3)}`,
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
                Yeni Etiket
              </Button>
            </Stack>

            {/* Enhanced Filters */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <TextField
                size="small"
                placeholder="Etiket ara..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
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
                        onClick={() => {
                          setQuery("");
                          setCurrentPage(1);
                        }}
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

              {(query || nameSort) && (
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

        {/* Enhanced Table */}
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
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                      },
                    }}
                    onClick={handleNameSort}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="inherit" fontWeight={700}>
                        Etiket Adı
                      </Typography>
                      <ImportExportIcon
                        sx={{
                          fontSize: 16,
                          color: nameSort ? "primary.main" : "text.disabled",
                          transform:
                            nameSort === "desc" ? "rotate(180deg)" : "none",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, width: 140 }}>
                    İşlemler
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <Skeleton width="60%" height={20} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Skeleton variant="circular" width={36} height={36} />
                          <Skeleton variant="circular" width={36} height={36} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && paginatedTags.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ py: 8 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <LocalOfferIcon
                          sx={{ fontSize: 64 }}
                          color="disabled"
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Etiket bulunamadı
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {query
                            ? "Aradığınız kriterlere uygun etiket bulunamadı"
                            : "Henüz etiket bulunmuyor"}
                        </Typography>
                        {(query || nameSort) && (
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
                  paginatedTags.map((tag, index) => (
                    <StyledTableRow key={tag._id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TagIcon
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {tag.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
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
                              onClick={() => openEditDialog(tag)}
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
                                  bgcolor: alpha(t.palette.primary.main, 0.2),
                                },
                                transition: "all 0.3s ease",
                              })}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sil" arrow>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setDeleteTagId(tag._id);
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
                                },
                                transition: "all 0.3s ease",
                              })}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Enhanced Table Footer with Pagination */}
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
                  Toplam {filtered.length} etiket
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Sayfa {currentPage} / {totalPages}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Gösterilen {paginatedTags.length} etiket
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
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&.Mui-selected": {
                        background: (t) =>
                          `linear-gradient(135deg, ${
                            t.palette.primary.main
                          }, ${darken(t.palette.primary.main, 0.2)})`,
                      },
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Enhanced Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          TransitionComponent={Transition}
          fullWidth
          maxWidth="sm"
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
              pt: 3,
              fontSize: "1.4rem",
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "rgba(0, 0, 0, 0)",
            }}
          >
            {editingTag ? "Etiketi Düzenle" : "Yeni Etiket Ekle"}
          </DialogTitle>

          <DialogContent sx={{ pt: 4, pb: 3 }}>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Etiket Adı"
                fullWidth
                value={tagInput}
                autoFocus
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    height: 56,
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
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
              onClick={handleSave}
              variant="contained"
              disabled={saving}
              sx={(t) => ({
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                background: `linear-gradient(135deg, ${
                  t.palette.primary.main
                }, ${darken(t.palette.primary.main, 0.2)})`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(t.palette.primary.main, 0.4)}`,
                },
              })}
            >
              {saving ? "Kaydediliyor..." : editingTag ? "Güncelle" : "Ekle"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Delete Dialog */}
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
            Etiketi Kalıcı Olarak Sil
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
                Etiket ve tüm ilişkili veriler kalıcı olarak silinecektir.
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

export default AdminTagsPage;
