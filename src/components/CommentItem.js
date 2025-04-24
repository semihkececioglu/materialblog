// ✅ CommentItem.js (admin silme yetkisi ve yalnızca kendi yorumuna düzenleme/silme yetkisi eklendi)
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
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
import getTimeAgo from "../utils/getTimeAgo";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../contexts/AuthContext";

const CommentItem = ({
  comment,
  onReplySubmit,
  replyingTo,
  setReplyingTo,
  onDelete,
}) => {
  const { user } = useAuth();
  const currentUserKey = user?.username || user?.name;
  const isOwner = user?.name === comment.name;
  const isAdmin =
    user?.username?.toLowerCase() === "admin" ||
    user?.name?.toLowerCase() === "admin";

  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const likeKey = `comment_like_${comment.id}`;
  const countKey = `comment_count_${comment.id}`;

  useEffect(() => {
    const storedLiked = JSON.parse(localStorage.getItem(likeKey)) || {};
    const storedCount = JSON.parse(localStorage.getItem(countKey)) || 0;

    setLikeCount(storedCount);

    if (currentUserKey && storedLiked[currentUserKey]) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [currentUserKey, likeKey, countKey]);

  const handleLike = () => {
    if (!user) {
      setShowAlert(true);
      return;
    }

    if (user.name === comment.name) return;

    const storedLiked = JSON.parse(localStorage.getItem(likeKey)) || {};
    const alreadyLiked = storedLiked[currentUserKey];

    let newCount = likeCount;

    if (alreadyLiked) {
      delete storedLiked[currentUserKey];
      newCount--;
      setLiked(false);
    } else {
      storedLiked[currentUserKey] = true;
      newCount++;
      setLiked(true);
    }

    setLikeCount(newCount);
    localStorage.setItem(likeKey, JSON.stringify(storedLiked));
    localStorage.setItem(countKey, JSON.stringify(newCount));
  };

  const handleReply = () => {
    const responderName = user ? user.name : replyName;
    if (!responderName.trim() || !replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      name: responderName,
      text: replyText,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(
        Math.random() * 1000
      )}`,
      date: new Date().toISOString(),
      replies: [],
    };
    onReplySubmit(comment.id, newReply);
    setReplyText("");
    setReplyName("");
    setReplyingTo(null);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, ml: 4, p: 2, borderRadius: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={comment.name}>
              <Avatar src={comment.avatar} alt={comment.name} sx={{ mr: 1 }} />
            </Tooltip>
            <Box>
              <Typography variant="subtitle2">{comment.name}</Typography>
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
                onClick={() => {
                  comment.text = editedText;
                  setEditMode(false);
                }}
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
            sx={{ textTransform: "none" }}
            startIcon={
              <FavoriteIcon
                color={liked ? "error" : "disabled"}
                sx={{
                  transition: "transform 0.2s ease",
                  transform: liked ? "scale(1.3)" : "scale(1)",
                }}
              />
            }
          >
            {liked ? "Beğenmekten Vazgeç" : "Beğen"} ({likeCount})
          </Button>

          <Button
            size="small"
            onClick={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
            sx={{ textTransform: "none" }}
            startIcon={<ChatBubbleOutlineIcon />}
          >
            {replyingTo === comment.id ? "Yanıtlamaktan Vazgeç" : "Yanıtla"}
          </Button>
        </Box>

        {replyingTo === comment.id && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Ad Soyad"
              fullWidth
              value={user ? user.name : replyName}
              onChange={(e) => setReplyName(e.target.value)}
              sx={{ mb: 1 }}
              disabled={!!user}
            />
            <TextField
              label="Cevabınız"
              fullWidth
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 1 }}
              onClick={handleReply}
            >
              Gönder
            </Button>
          </Box>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <List sx={{ mt: 2, ml: 2 }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReplySubmit={onReplySubmit}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onDelete={onDelete}
              />
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Yorumu silmek istiyor musunuz?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bu işlem geri alınamaz. Yorum ve varsa tüm alt yanıtlar silinecek.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>İptal</Button>
            <Button
              onClick={() => {
                onDelete(comment.id);
                setOpenDialog(false);
              }}
              autoFocus
              color="error"
            >
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
      </CardContent>
    </Card>
  );
};

export default CommentItem;
