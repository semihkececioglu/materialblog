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
import axios from "axios";

const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [postTitles, setPostTitles] = useState({});
  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        "https://materialblog-server-production.up.railway.app/api/comments"
      );
      const commentList = res.data;
      setComments(commentList);

      // Her unique postId için başlıkları çek
      const uniquePostIds = [...new Set(commentList.map((c) => c.postId))];
      const titleMap = {};

      await Promise.all(
        uniquePostIds.map(async (postId) => {
          try {
            const postRes = await axios.get(
              `https://materialblog-server-production.up.railway.app/api/posts/${postId}`
            );
            titleMap[postId] = postRes.data.title;
          } catch {
            titleMap[postId] = "Bilinmeyen Yazı";
          }
        })
      );

      setPostTitles(titleMap);
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://materialblog-server-production.up.railway.app/api/comments/${deleteInfo.id}`
      );
      setDeleteInfo({ open: false, id: null });
      fetchComments();
    } catch (err) {
      console.error("Yorum silinemedi:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Yorumlar
      </Typography>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
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
                  <TableRow key={comment._id}>
                    <TableCell>
                      {comment.username || comment.name || "Anonim"}
                    </TableCell>
                    <TableCell>{comment.text}</TableCell>
                    <TableCell>
                      {postTitles[comment.postId] || "Yükleniyor..."}
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
