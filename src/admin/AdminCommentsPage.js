import React, { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
import ForumIcon from "@mui/icons-material/Forum";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, deleteComment } from "../redux/commentSlice";
import axios from "axios";

const AdminCommentsPage = () => {
  const dispatch = useDispatch();
  const { items: comments } = useSelector((state) => state.comments);
  const [postTitles, setPostTitles] = useState({});
  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null });
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredComments = comments.filter((comment) =>
    comment.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLikes = comments.reduce(
    (acc, comment) => acc + (comment.likes?.length || 0),
    0
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stats & Search Header */}
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
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Title & Stats */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <ForumIcon sx={{ fontSize: 28, color: "primary.main" }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Yorumlar
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={`${comments.length} yorum`}
                  size="small"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 500,
                    height: "24px",
                  }}
                />
                <Chip
                  label={`${totalLikes} beğeni`}
                  size="small"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    color: "error.main",
                    fontWeight: 500,
                    height: "24px",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Search & Filter */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Yorumlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 240,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.6),
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Comments Table */}
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
                  sx={{
                    py: 3,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  Kullanıcı
                </TableCell>
                <TableCell
                  sx={{
                    py: 3,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  Yorum
                </TableCell>
                <TableCell
                  sx={{
                    py: 3,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  Yazı
                </TableCell>
                <TableCell
                  sx={{
                    py: 3,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  Tarih
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    py: 3,
                    px: 3,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 18, color: "error.main" }} />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 3,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell sx={{ py: 2.5, px: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          src={comment.user?.profileImage}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: (theme) =>
                              !comment.user?.profileImage &&
                              alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                          }}
                        >
                          {(comment.user?.username?.[0] || "").toUpperCase()}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            my: "auto",
                          }}
                        >
                          {comment.user?.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, maxWidth: 300 }}>
                      <Tooltip title={comment.text} arrow placement="top">
                        <Typography
                          sx={{
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.5,
                          }}
                        >
                          {comment.text}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3 }}>
                      <Typography sx={{ color: "text.secondary" }}>
                        {postTitles[comment.postId?.toString?.()] ||
                          "Yükleniyor..."}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, color: "text.secondary" }}>
                      {new Date(comment.date).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.5, px: 3 }}>
                      <Typography
                        sx={{
                          color: "error.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        {comment.likes?.length || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2.5, px: 3 }}>
                      <Tooltip title="Sil" arrow>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDeleteInfo({ open: true, id: comment._id })
                          }
                          sx={{
                            color: "error.main",
                            bgcolor: (theme) =>
                              alpha(theme.palette.error.main, 0.1),
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      sx={{
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "text.secondary",
                      }}
                    >
                      <ForumIcon
                        sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                      />
                      <Typography>Henüz yorum eklenmedi.</Typography>
                    </Box>
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
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Yorumu Sil
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography>Bu yorumu silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteInfo({ open: false, id: null })}
            sx={{ borderRadius: 2 }}
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCommentsPage;
