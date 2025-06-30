import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  TextField,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleLikeComment,
  deleteComment,
  editComment,
} from "../redux/commentSlice";
import getTimeAgo from "../utils/getTimeAgo";

const stringToColor = (name) => {
  if (!name || typeof name !== "string") return "#888";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const CommentItem = ({
  comment,
  onReplySubmit,
  replyingTo,
  setReplyingTo,
  onNotify,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const isOwner = user?.username === comment.username;
  const isAdmin = user?.role === "admin";

  const [replyText, setReplyText] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [replyName, setReplyName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const displayName = comment.username || comment.name || "Anonim";

  useEffect(() => {
    setLiked(comment.likes?.includes(user?.username));
    setLikeCount(comment.likes?.length || 0);
  }, [comment.likes, user?.username]);

  const handleLike = () => {
    if (!user) return setShowAlert(true);
    if (isOwner) return;

    dispatch(
      toggleLikeComment({ commentId: comment._id, username: user.username })
    ).then((res) => {
      const updated = res.payload;
      if (!updated?.likes) return;
      setLiked(updated.likes.includes(user.username));
      setLikeCount(updated.likes.length);
      onNotify?.(
        updated.likes.includes(user.username)
          ? "Beğenildi"
          : "Beğenme geri alındı"
      );
    });
  };

  const handleReply = () => {
    const responderUsername = user?.username || replyName;
    if (!responderUsername.trim() || !replyText.trim()) return;

    const newReply = {
      username: responderUsername,
      email: user?.email || replyEmail,
      text: replyText,
      parentId: comment._id,
      postId: comment.postId, // ✅ reply'nin bağlandığı postId
    };

    onReplySubmit(comment._id, newReply);
    setReplyText("");
    setReplyName("");
    setReplyEmail("");
    setReplyingTo(null);
    onNotify?.("Yanıt eklendi");
  };

  const handleEditSubmit = async () => {
    try {
      await dispatch(editComment({ id: comment._id, text: editedText }));
      setEditMode(false);
      setSnackbar({ open: true, message: "Yorum güncellendi" });
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment._id));
    setOpenDialog(false);
    setSnackbar({ open: true, message: "Yorum silindi" });
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, ml: 4, p: 2, borderRadius: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={displayName}>
              <Avatar
                sx={{
                  bgcolor: stringToColor(displayName),
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  mr: 1,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            <Box>
              <Typography variant="subtitle2">{displayName}</Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                title={new Date(comment.date).toLocaleString()}
              >
                {getTimeAgo(comment.date)}
              </Typography>
            </Box>
          </Box>

          <Box>
            {isOwner && (
              <IconButton onClick={() => setEditMode(!editMode)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {(isOwner || isAdmin) && (
              <IconButton onClick={() => setOpenDialog(true)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {!editMode ? (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {comment.text}
          </Typography>
        ) : (
          <>
            <TextField
              fullWidth
              multiline
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 1,
              }}
            >
              <Button
                onClick={handleEditSubmit}
                variant="contained"
                size="small"
              >
                Kaydet
              </Button>
              <Button onClick={() => setEditMode(false)} size="small">
                İptal
              </Button>
            </Box>
          </>
        )}

        <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
          <Button
            size="small"
            onClick={handleLike}
            disabled={isOwner}
            sx={{ textTransform: "none" }}
            startIcon={
              <FavoriteIcon
                color={user && liked ? "error" : "disabled"}
                sx={{
                  transition: "transform 0.2s ease",
                  transform: user && liked ? "scale(1.3)" : "scale(1)",
                }}
              />
            }
          >
            {user && liked ? "Beğenmekten Vazgeç" : "Beğen"} ({likeCount})
          </Button>

          <Button
            size="small"
            onClick={() =>
              setReplyingTo(replyingTo === comment._id ? null : comment._id)
            }
            sx={{ textTransform: "none" }}
            startIcon={<ChatBubbleOutlineIcon />}
          >
            {replyingTo === comment._id ? "Yanıtlamaktan Vazgeç" : "Yanıtla"}
          </Button>
        </Box>

        {replyingTo === comment._id && (
          <Box sx={{ mt: 2 }}>
            {!user && (
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Ad Soyad"
                  fullWidth
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  size="small"
                />
                <TextField
                  label="E-posta"
                  fullWidth
                  value={replyEmail}
                  onChange={(e) => setReplyEmail(e.target.value)}
                  size="small"
                />
              </Box>
            )}
            <TextField
              label="Cevabınız"
              fullWidth
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              multiline
              rows={2}
              size="small"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                onClick={handleReply}
              >
                Gönder
              </Button>
            </Box>
          </Box>
        )}

        {comment.replies?.length > 0 && (
          <List sx={{ mt: 2, ml: 2 }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                onReplySubmit={onReplySubmit}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onNotify={onNotify}
              />
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Yorumu silmek istiyor musunuz?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bu işlem geri alınamaz. Yorum ve varsa yanıtlar silinecek.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Vazgeç</Button>
            <Button onClick={handleDelete} autoFocus color="error">
              Evet, Sil
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" variant="filled">
            Yorumu beğenebilmek için giriş yapmalısınız.
          </Alert>
        </Snackbar>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: "" })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Paper>
  );
};

export default CommentItem;
