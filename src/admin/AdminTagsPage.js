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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AdminTagsPage = () => {
  const [tags, setTags] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);

  // Etiketleri backend'den çek
  const fetchTags = async () => {
    try {
      const res = await axios.get(
        "https://materialblog-server-production.up.railway.app/api/tags"
      );
      setTags(res.data);
    } catch (err) {
      console.error("Etiketler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

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
      fetchTags();
      setOpenDialog(false);
      setTagInput("");
      setEditingTag(null);
    } catch (err) {
      console.error("Etiket kaydetme hatası:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://materialblog-server-production.up.railway.app/api/tags/${deleteTagId}`
      );
      fetchTags();
      setConfirmDelete(false);
      setDeleteTagId(null);
    } catch (err) {
      console.error("Etiket silme hatası:", err);
    }
  };

  const openEditDialog = (tag) => {
    setEditingTag(tag);
    setTagInput(tag.name);
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
          Etiketler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTag(null);
            setTagInput("");
            setOpenDialog(true);
          }}
          sx={{ borderRadius: 3 }}
        >
          Etiket Ekle
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
              {tags.map((tag, index) => (
                <TableRow
                  key={tag._id}
                  hover
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(tag)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTagId(tag._id);
                        setConfirmDelete(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {tags.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Henüz etiket eklenmedi.
                  </TableCell>
                </TableRow>
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
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle>
          {editingTag ? "Etiketi Düzenle" : "Yeni Etiket"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Etiket Adı"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
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
        <DialogTitle>Bu etiketi silmek istediğinize emin misiniz?</DialogTitle>
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

export default AdminTagsPage;
