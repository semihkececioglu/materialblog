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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, deleteTag } from "../redux/tagSlice";
import axios from "axios";
import { alpha, darken } from "@mui/material/styles";

const CONTROL_H = 38;
const SKELETON_ROWS = 6;

const AdminTagsPage = () => {
  const dispatch = useDispatch();
  const { items: tags = [], loading } = useSelector((state) => state.tags);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);

  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!query.trim()) return tags;
    const q = query.toLowerCase();
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, query]);

  const openEditDialog = (tag) => {
    setEditingTag(tag);
    setTagInput(tag.name);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!tagInput.trim()) return;
    setSaving(true);
    try {
      if (editingTag) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app/api/tags/${editingTag._id}`,
          { name: tagInput.trim() }
        );
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app/api/tags",
          { name: tagInput.trim() }
        );
      }
      await dispatch(fetchTags());
      setOpenDialog(false);
      setTagInput("");
      setEditingTag(null);
    } catch (err) {
      console.error("Etiket kaydetme hatası:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteTag(deleteTagId));
    setConfirmDelete(false);
    setDeleteTagId(null);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 4, md: 5 }, position: "relative" }}
    >
      {/* Ambient background (uyumlu) */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (t) =>
            t.palette.mode === "dark"
              ? `radial-gradient(circle at 18% 20%, ${alpha(
                  t.palette.primary.main,
                  0.18
                )}, transparent 60%), linear-gradient(135deg, ${
                  t.palette.background.default
                }, ${t.palette.background.default})`
              : `radial-gradient(circle at 18% 20%, ${alpha(
                  t.palette.primary.light,
                  0.5
                )}, transparent 65%), linear-gradient(135deg, ${
                  t.palette.background.default
                }, ${t.palette.background.paper})`,
        }}
      />

      {/* HEADER (ortak tasarım dili) */}
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
          background: alpha(t.palette.background.paper, 0.85),
          backdropFilter: "blur(18px)",
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
            )}, transparent 65%)`,
            pointerEvents: "none",
          },
        })}
      >
        {/* Title row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            <LocalOfferIcon color="primary" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.1 }}
            >
              Etiketler
            </Typography>
            <Box sx={{ mt: 0.6, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                size="small"
                icon={<LocalOfferIcon sx={{ fontSize: 18 }} />}
                label={`${tags.length} Etiket`}
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
                label={`${filtered.length} Görüntülenen`}
                sx={{
                  height: 30,
                  fontWeight: 600,
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.08),
                  ".MuiChip-label": { px: 1.2 },
                }}
              />
            </Box>
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTag(null);
              setTagInput("");
              setOpenDialog(true);
            }}
            sx={{
              height: CONTROL_H,
              borderRadius: 3,
              textTransform: "none",
              fontSize: 13,
              fontWeight: 600,
              px: 2.4,
              background: (t) =>
                `linear-gradient(90deg, ${t.palette.primary.main}, ${darken(
                  t.palette.primary.main,
                  0.12
                )})`,
            }}
          >
            Yeni Etiket
          </Button>
        </Box>

        {/* Filter row */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.4 }}>
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Etiket ara"
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
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery("")}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
        <TableContainer sx={{ maxHeight: 620 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 70 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Etiket Adı</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, width: 140 }}>
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell sx={{ py: 1.8 }}>
                      <Skeleton width={42} height={28} />
                    </TableCell>
                    <TableCell sx={{ py: 1.8 }}>
                      <Skeleton width="40%" height={20} />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.8 }}>
                      <Skeleton width={74} height={30} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        opacity: 0.75,
                      }}
                    >
                      <LocalOfferIcon color="disabled" sx={{ fontSize: 50 }} />
                      <Typography variant="body2" color="text.secondary">
                        Etiket bulunamadı.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filtered.map((tag, index) => (
                  <TableRow
                    key={tag._id}
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
                        sx={(t) => ({
                          width: 34,
                          height: 30,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                          fontSize: 13,
                          bgcolor: alpha(t.palette.primary.main, 0.12),
                          color: "primary.main",
                        })}
                      >
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          letterSpacing: ".2px",
                        }}
                      >
                        {tag.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.6 }}>
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
                            onClick={() => openEditDialog(tag)}
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
                              setDeleteTagId(tag._id);
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            px: 3,
            py: 2.2,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Toplam {tags.length} etiket
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Görüntülenen: {filtered.length}
          </Typography>
        </Box>
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: "100%",
            maxWidth: 420,
            p: 0,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editingTag ? "Etiketi Düzenle" : "Yeni Etiket"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingTag ? "Mevcut etiketi güncelle" : "Yeni bir etiket ekle"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Etiket Adı"
            value={tagInput}
            autoFocus
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: (t) => alpha(t.palette.background.paper, 0.6),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: "none", borderRadius: 3 }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={(t) => ({
              textTransform: "none",
              borderRadius: 3,
              fontWeight: 600,
              px: 3,
              background: `linear-gradient(90deg, ${
                t.palette.primary.main
              }, ${darken(t.palette.primary.main, 0.15)})`,
            })}
          >
            {saving ? "Kaydediliyor..." : editingTag ? "Güncelle" : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: "100%",
            maxWidth: 400,
            p: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ pb: 0.4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Etiketi Sil
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Bu işlem geri alınamaz
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography fontSize={13}>
            Seçili etiketi kalıcı olarak silmek istiyor musunuz?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setConfirmDelete(false)}
            sx={{ textTransform: "none", borderRadius: 3 }}
          >
            Vazgeç
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
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
    </Container>
  );
};

export default AdminTagsPage;
