import React, { useEffect, useState } from "react";
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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, deleteTag } from "../redux/tagSlice";
import axios from "axios";
import { alpha } from "@mui/material/styles";

const AdminTagsPage = () => {
  const dispatch = useDispatch();
  const { items: tags, loading } = useSelector((state) => state.tags);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleSave = async () => {
    if (tagInput.trim() === "") return;

    try {
      if (editingTag) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app/api/tags/${editingTag._id}`,
          { name: tagInput }
        );
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app/api/tags",
          { name: tagInput }
        );
      }
      dispatch(fetchTags());
      setOpenDialog(false);
      setTagInput("");
      setEditingTag(null);
    } catch (err) {
      console.error("Etiket kaydetme hatası:", err);
    }
  };

  const handleDelete = async () => {
    dispatch(deleteTag(deleteTagId));
    setConfirmDelete(false);
    setDeleteTagId(null);
  };

  const openEditDialog = (tag) => {
    setEditingTag(tag);
    setTagInput(tag.name);
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
            <LocalOfferIcon
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
                Etiketler
              </Typography>
              <Chip
                label={`${tags.length} etiket`}
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
              setEditingTag(null);
              setTagInput("");
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
            Yeni Etiket
          </Button>
        </Box>
      </Paper>

      {/* Tags Table */}
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ py: 2, px: 3, fontWeight: 600, width: "60px" }}
                >
                  #
                </TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  Etiket Adı
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ py: 2, px: 3, fontWeight: 600, width: "120px" }}
                >
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 3 }}
                    >
                      <CircularProgress size={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 8,
                        color: "text.secondary",
                      }}
                    >
                      <LocalOfferIcon
                        sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                      />
                      <Typography>Henüz etiket eklenmedi.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag, index) => (
                  <TableRow
                    key={tag._id}
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
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "text.primary",
                        }}
                      >
                        {tag.name}
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
                            onClick={() => openEditDialog(tag)}
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
                              setDeleteTagId(tag._id);
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Etiket Ekle / Düzenle Dialog */}
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
            {editingTag ? "Etiketi Düzenle" : "Yeni Etiket"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            fullWidth
            label="Etiket Adı"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
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
            {editingTag ? "Güncelle" : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme onayı */}
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
            Etiketi Sil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Bu etiketi silmek istediğinize emin misiniz?</Typography>
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

export default AdminTagsPage;
