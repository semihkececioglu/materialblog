// CommentItem.js
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
  ListItem,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import getTimeAgo from "../utils/getTimeAgo";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const stringToColor = (name) => {
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
  onDelete,
  onUpdate,
  currentUser,
}) => {
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [likes, setLikes] = useState(
    parseInt(localStorage.getItem(`likes_${comment.id}`)) || comment.likes || 0
  );
  const [dislikes, setDislikes] = useState(
    parseInt(localStorage.getItem(`dislikes_${comment.id}`)) ||
      comment.dislikes ||
      0
  );
  const [vote, setVote] = useState(null);
  const { user } = useAuth();

  const isOwnComment = user?.name === comment.name;

  useEffect(() => {
    const voteKey = `vote_${comment.id}_${user?.name}`;
    const storedVote = localStorage.getItem(voteKey);
    if (storedVote) setVote(storedVote);
  }, [comment.id, user]);

  const handleReply = () => {
    const responderName = user ? user.name : replyName;
    if (!responderName.trim() || !replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      name: responderName,
      text: replyText,
      avatar: user ? undefined : null,
      date: new Date().toISOString(),
      replies: [],
      likes: 0,
      dislikes: 0,
      userId: user?.name || responderName,
    };
    onReplySubmit(comment.id, newReply);
    setReplyName("");
    setReplyText("");
    setReplyingTo(null);
  };

  const updateVotes = (newLikes, newDislikes, newVote) => {
    setLikes(newLikes);
    setDislikes(newDislikes);
    setVote(newVote);
    localStorage.setItem(`likes_${comment.id}`, newLikes);
    localStorage.setItem(`dislikes_${comment.id}`, newDislikes);
    localStorage.setItem(`vote_${comment.id}_${user?.name}`, newVote || "");
  };

  const handleLike = () => {
    if (isOwnComment) return;
    if (vote === "like") {
      updateVotes(likes - 1, dislikes, null);
    } else if (vote === "dislike") {
      updateVotes(likes + 1, dislikes - 1, "like");
    } else {
      updateVotes(likes + 1, dislikes, "like");
    }
  };

  const handleDislike = () => {
    if (isOwnComment) return;
    if (vote === "dislike") {
      updateVotes(likes, dislikes - 1, null);
    } else if (vote === "like") {
      updateVotes(likes - 1, dislikes + 1, "dislike");
    } else {
      updateVotes(likes, dislikes + 1, "dislike");
    }
  };

  const handleSaveEdit = () => {
    onUpdate(comment.id, editText);
    setIsEditing(false);
  };

  const canDeleteOrEdit =
    currentUser &&
    (currentUser.name.toLowerCase() === "admin" ||
      currentUser.name === comment.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip
                title={`${comment.name} • ${getTimeAgo(comment.date)}`}
                arrow
              >
                <Box
                  component={Link}
                  to={`/profile/${comment.name}`}
                  sx={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: stringToColor(comment.name),
                      color: "white",
                    }}
                  >
                    {comment.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
              </Tooltip>
              <Box>
                <Typography
                  component={Link}
                  to={`/profile/${comment.name}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {comment.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(comment.date)}
                </Typography>
              </Box>
            </Box>
            {canDeleteOrEdit && (
              <Box>
                <Tooltip title="Düzenle">
                  <IconButton onClick={() => setIsEditing(!isEditing)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sil">
                  <IconButton edge="end" onClick={() => setOpenDialog(true)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {isEditing ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                  gap: 1,
                }}
              >
                <Button size="small" onClick={() => setIsEditing(false)}>
                  İptal
                </Button>
                <Button
                  size="small"
                  onClick={handleSaveEdit}
                  variant="contained"
                >
                  Kaydet
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {comment.text}
            </Typography>
          )}

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              size="small"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              sx={{ textTransform: "none" }}
              startIcon={<ChatBubbleOutlineIcon />}
            >
              Yanıtla
            </Button>
            <Button
              size="small"
              startIcon={<ThumbUpAltOutlinedIcon />}
              onClick={handleLike}
              color={vote === "like" ? "primary" : "inherit"}
              disabled={isOwnComment}
            >
              {likes}
            </Button>
            <Button
              size="small"
              startIcon={<ThumbDownAltOutlinedIcon />}
              onClick={handleDislike}
              color={vote === "dislike" ? "error" : "inherit"}
              disabled={isOwnComment}
            >
              {dislikes}
            </Button>
          </Box>

          {replyingTo === comment.id && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Ad Soyad"
                fullWidth
                value={user ? user.name : replyName}
                onChange={(e) => setReplyName(e.target.value)}
                disabled={!!user}
                sx={{ mb: 1 }}
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
            <List sx={{ mt: 2 }}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReplySubmit={onReplySubmit}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  currentUser={currentUser}
                />
              ))}
            </List>
          )}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Yorumu silmek istiyor musunuz?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Bu işlem geri alınamaz. Yorum ve varsa tüm alt yanıtlar
                silinecek.
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommentItem;
