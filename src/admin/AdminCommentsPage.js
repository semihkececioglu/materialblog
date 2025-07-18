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
  DialogTitle,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, deleteComment } from "../redux/commentSlice";
import axios from "axios";

const AdminCommentsPage = () => {
  const dispatch = useDispatch();
  const { items: comments } = useSelector((state) => state.comments);
  const [postTitles, setPostTitles] = useState({});
  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    if (comments.length > 0) {
      const uniquePostIds = [
        ...new Set(comments.map((c) => c.postId?.toString?.())),
      ];
      const titleMap = {};

      Promise.all(
        uniquePostIds.map(async (postId) => {
          try {
            const res = await axios.get(
              `https://materialblog-server-production.up.railway.app/api/posts/${postId}`
            );
            titleMap[postId] = res.data.title;
          } catch {
            titleMap[postId] = "Bilinmeyen Yazı";
          }
        })
      ).then(() => setPostTitles(titleMap));
    }
  }, [comments]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteComment(deleteInfo.id));
      setDeleteInfo({ open: false, id: null });
    } catch (err) {
      console.error("Yorum silinemedi:", err);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Yorumlar
      </Typography>

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
                <TableCell>Ad</TableCell>
                <TableCell>Yorum</TableCell>
                <TableCell>Yazı Başlığı</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>
                  <Tooltip title="Beğeni Sayısı">
                    <FavoriteIcon color="error" fontSize="small" />
                  </Tooltip>
                </TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <TableRow
                    key={comment._id}
                    sx={{
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell>{comment.user?.username || "Anonim"}</TableCell>
                    <TableCell>{comment.text}</TableCell>
                    <TableCell>
                      {postTitles[comment.postId?.toString?.()] ||
                        "Yükleniyor..."}
                    </TableCell>
                    <TableCell>
                      {new Date(comment.date).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell>{comment.likes?.length || 0}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sil">
                        <IconButton
                          color="error"
                          onClick={() =>
                            setDeleteInfo({ open: true, id: comment._id })
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Hiç yorum bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={deleteInfo.open}
        onClose={() => setDeleteInfo({ open: false, id: null })}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle>Bu yorumu silmek istiyor musunuz?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteInfo({ open: false, id: null })}>
            Vazgeç
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCommentsPage;
