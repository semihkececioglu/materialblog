import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  CardContent,
  IconButton,
  List,
  TextField,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleLikeComment,
  deleteComment,
  editComment,
} from "../../redux/commentSlice";
import getTimeAgo from "../../utils/getTimeAgo";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  onDelete,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const isOwner = user?.username === comment.user?.username;
  const isAdmin = user?.role === "admin";

  const [replyText, setReplyText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [loginWarn, setLoginWarn] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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
    if (!user) return;
    if (!replyText.trim()) return;

    const newReply = {
      user: user.id,
      text: replyText,
      parentId: comment._id,
      postId: comment.postId,
    };

    onReplySubmit(comment._id, newReply);
    setReplyText("");
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

  const displayName = comment.user?.username || "Anonim";

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        ml: comment.parentId ? { xs: 2, md: 4 } : 0,
        p: 2,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={displayName}>
              <Avatar
                src={comment.user?.profileImage || ""}
                sx={{
                  bgcolor: comment.user?.profileImage
                    ? "transparent"
                    : stringToColor(displayName),
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  mr: 1,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {!comment.user?.profileImage &&
                  displayName.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  cursor: comment.user?.username ? "pointer" : "default",
                  textDecoration: comment.user?.username ? "underline" : "none",
                  "&:hover": {
                    opacity: comment.user?.username ? 0.8 : 1,
                  },
                }}
                onClick={() =>
                  comment.user?.username &&
                  navigate(`/profile/${comment.user.username}`)
                }
              >
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
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
            onClick={() => {
              if (!user) return setLoginWarn(true);
              setReplyingTo(replyingTo === comment._id ? null : comment._id);
            }}
            sx={{ textTransform: "none" }}
            startIcon={<ChatBubbleOutlineIcon />}
          >
            {replyingTo === comment._id ? "Yanıtlamaktan Vazgeç" : "Yanıtla"}
          </Button>
        </Box>

        {replyingTo === comment._id && (
          <Box sx={{ mt: 2 }}>
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
          <List sx={{ mt: 2, pl: { xs: 2, md: 4 } }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                onReplySubmit={onReplySubmit}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onNotify={onNotify}
                onDelete={onDelete}
              />
            ))}
          </List>
        )}

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
          open={loginWarn}
          autoHideDuration={3000}
          onClose={() => setLoginWarn(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" variant="filled">
            Yanıt yazabilmek için giriş yapmalısınız.
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

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          TransitionComponent={Slide}
          TransitionProps={{ direction: "up" }}
          fullScreen={fullScreen}
          PaperProps={{
            sx: {
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              px: 3,
              py: 2,
              minWidth: { xs: "90%", sm: 400 },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            <WarningAmberRoundedIcon color="warning" />
            Yorumu Sil
          </DialogTitle>

          <DialogContent>
            <Typography>
              Bu yorumu silmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "flex-end", gap: 1 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              color="primary"
            >
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                onDelete(comment._id);
                setOpenDialog(false);
              }}
              variant="contained"
              color="error"
            >
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Paper>
  );
};

export default CommentItem;
