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

const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null });

  useEffect(() => {
    const allComments = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("comments_")) {
        const postId = key.replace("comments_", "");
        const parsed = JSON.parse(localStorage.getItem(key));

        const flatten = (items, parentTitle = postId) => {
          return items.flatMap((item) => [
            {
              id: item.id,
              name: item.name,
              text: item.text,
              date: item.date,
              postId: parentTitle,
            },
            ...(item.replies ? flatten(item.replies, parentTitle) : []),
          ]);
        };

        if (Array.isArray(parsed)) {
          allComments.push(...flatten(parsed));
        }
      }
    });
    setComments(allComments);
  }, []);

  const handleDelete = () => {
    const updated = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("comments_")) {
        const parsed = JSON.parse(localStorage.getItem(key));
        const newComments = deleteCommentRecursive(parsed, deleteInfo.id);
        localStorage.setItem(key, JSON.stringify(newComments));
      }
    });
    setDeleteInfo({ open: false, id: null });
    window.location.reload();
  };

  const deleteCommentRecursive = (comments, targetId) => {
    return comments
      .filter((comment) => comment.id !== targetId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies
          ? deleteCommentRecursive(comment.replies, targetId)
          : [],
      }));
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
                <TableCell>Yazı</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.name}</TableCell>
                    <TableCell>{comment.text}</TableCell>
                    <TableCell>{comment.postId}</TableCell>
                    <TableCell>
                      {new Date(comment.date).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sil">
                        <IconButton
                          color="error"
                          onClick={() =>
                            setDeleteInfo({ open: true, id: comment.id })
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
                  <TableCell colSpan={5} align="center">
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
