import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  alpha,
  Fade,
  Collapse,
  Badge,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleLikeComment,
  deleteComment,
  editComment,
} from "../../redux/commentSlice";
import getTimeAgo from "../../utils/getTimeAgo";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const getAvatarColor = (name) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const CommentItem = ({
  comment,
  onReplySubmit,
  replyingTo,
  setReplyingTo,
  onNotify,
  onDelete,
  showSnackbar,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const isOwner = user?.username === comment.user?.username;
  const isAdmin = user?.role === "admin";
  const isCommentAuthorAdmin = comment.user?.role === "admin";

  const [replyText, setReplyText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const isReply = !!comment.parentId;

  useEffect(() => {
    setLiked(comment.likes?.includes(user?.username));
    setLikeCount(comment.likes?.length || 0);
  }, [comment.likes, user?.username]);

  const handleLike = () => {
    if (!user) {
      showSnackbar("Giriş yapmalısınız!", "warning");
      return;
    }
    if (isOwner) return;

    dispatch(
      toggleLikeComment({ commentId: comment._id, username: user.username })
    ).then((res) => {
      const updated = res.payload;
      if (updated?.likes) {
        const isNowLiked = updated.likes.includes(user.username);
        setLiked(isNowLiked);
        setLikeCount(updated.likes.length);
      }
    });
  };

  const handleReply = () => {
    if (!user) {
      showSnackbar("Yanıt için giriş yapın!", "warning");
      return;
    }
    if (!replyText.trim()) return;

    onReplySubmit(comment._id, {
      user: user.id,
      text: replyText,
      parentId: comment._id,
      postId: comment.postId,
    });

    setReplyText("");
    setReplyingTo(null);
  };

  const handleEdit = async () => {
    try {
      await dispatch(editComment({ id: comment._id, text: editedText }));
      setEditMode(false);
      showSnackbar("Yorum başarıyla güncellendi", "success");
    } catch (err) {
      showSnackbar("Güncelleme başarısız", "error");
    }
  };

  const displayName = comment.user?.username || "Anonim";
  const avatarColor = getAvatarColor(displayName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <Box
        sx={{
          mb: 3,
          ml: isReply ? { xs: 2, md: 4 } : 0,
          position: "relative",
          "&::before": isReply && {
            content: '""',
            position: "absolute",
            left: { xs: -16, md: -24 },
            top: 12,
            width: { xs: 12, md: 20 },
            height: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 1,
          },
        }}
      >
        {/* Main Comment Container */}
        <Box
          sx={{
            p: 3,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 3,
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {/* Header with User Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              mb: 2,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar
                src={comment.user?.profileImage || comment.user?.profilePicture}
                onClick={() =>
                  comment.user?.username &&
                  navigate(`/profile/${comment.user.username}`)
                }
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: avatarColor,
                  cursor: comment.user?.username ? "pointer" : "default",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "white",
                  boxShadow: `0 2px 8px ${alpha(avatarColor, 0.3)}`,
                  transition: "all 0.2s ease",
                  "&:hover": comment.user?.username && {
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${alpha(avatarColor, 0.4)}`,
                  },
                }}
              >
                {!comment.user?.profileImage &&
                  !comment.user?.profilePicture &&
                  displayName.charAt(0).toUpperCase()}
              </Avatar>
            </motion.div>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Username and admin verification */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  onClick={() =>
                    comment.user?.username &&
                    navigate(`/profile/${comment.user.username}`)
                  }
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    cursor: comment.user?.username ? "pointer" : "default",
                    "&:hover": comment.user?.username && {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  {displayName}
                </Typography>

                {isCommentAuthorAdmin && (
                  <VerifiedIcon
                    sx={{
                      fontSize: 16,
                      color: "primary.main",
                      ml: 0.5,
                    }}
                  />
                )}
              </Box>

              {/* Timestamp */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ScheduleIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  {getTimeAgo(comment.date)}
                </Typography>
              </Box>
            </Box>

            {/* Action Menu - Fixed positioning to prevent layout shift */}
            <Box
              sx={{
                width: 32,
                height: 32,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AnimatePresence>
                {(showActions || isMobile || Boolean(menuAnchor)) &&
                  (isOwner || isAdmin) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(theme.palette.background.paper, 0.8),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </motion.div>
                  )}
              </AnimatePresence>
            </Box>
          </Box>

          {/* Comment Content */}
          <Box sx={{ mb: 2 }}>
            {!editMode ? (
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  color: "text.primary",
                  fontSize: "0.9rem",
                  wordBreak: "break-word",
                }}
              >
                {comment.text}
              </Typography>
            ) : (
              <Fade in={editMode}>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder="Yorumunuzu düzenleyin..."
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        fontSize: "0.9rem",
                        "& fieldset": {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
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
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setEditMode(false);
                        setEditedText(comment.text);
                      }}
                      sx={{
                        textTransform: "none",
                        color: "text.secondary",
                        fontSize: "0.8rem",
                      }}
                    >
                      İptal
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={handleEdit}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.8rem",
                        borderRadius: 2,
                      }}
                    >
                      Kaydet
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Like Button with Badge */}
            <Button
              size="small"
              startIcon={
                <Badge
                  badgeContent={likeCount > 0 ? likeCount : null}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.65rem",
                      height: 16,
                      minWidth: 16,
                      padding: "0 4px",
                    },
                  }}
                >
                  <motion.div
                    animate={liked ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {liked ? (
                      <FavoriteIcon sx={{ fontSize: 16, color: "#e74c3c" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                    )}
                  </motion.div>
                </Badge>
              }
              onClick={handleLike}
              disabled={isOwner}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                minWidth: "auto",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                color: liked ? "#e74c3c" : "text.secondary",
                "&:hover": {
                  bgcolor: liked
                    ? alpha("#e74c3c", 0.1)
                    : alpha(theme.palette.text.secondary, 0.1),
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              {liked ? "Beğenmekten vazgeç" : "Beğen"}
            </Button>

            {/* Reply Button */}
            <Button
              size="small"
              startIcon={<ReplyIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                if (!user) {
                  showSnackbar("Yanıt için giriş yapın!", "warning");
                  return;
                }
                setReplyingTo(replyingTo === comment._id ? null : comment._id);
              }}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                minWidth: "auto",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                color:
                  replyingTo === comment._id
                    ? "primary.main"
                    : "text.secondary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              {replyingTo === comment._id ? "İptal" : "Yanıtla"}
            </Button>
          </Box>

          {/* Reply Form */}
          <Collapse in={replyingTo === comment._id} timeout={300}>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                  src={user?.profilePicture || user?.profileImage}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: getAvatarColor(user?.username || "U"),
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {!user?.profilePicture &&
                    !user?.profileImage &&
                    (user?.username?.charAt(0).toUpperCase() || "U")}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Yanıtınızı yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        fontSize: "0.85rem",
                        "& fieldset": {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.8rem",
                        borderRadius: 2,
                        px: 2,
                      }}
                    >
                      Gönder
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>

          {/* Nested Replies */}
          {comment.replies?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              {comment.replies.map((reply, index) => (
                <motion.div
                  key={reply._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CommentItem
                    comment={reply}
                    onReplySubmit={onReplySubmit}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    onNotify={onNotify}
                    onDelete={onDelete}
                    showSnackbar={showSnackbar}
                  />
                </motion.div>
              ))}
            </Box>
          )}
        </Box>

        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          disableScrollLock={true}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 150,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            },
          }}
        >
          {isOwner && (
            <MenuItem
              onClick={() => {
                setEditMode(true);
                setMenuAnchor(null);
              }}
              sx={{ gap: 1.5, py: 1 }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">Düzenle</Typography>
            </MenuItem>
          )}
          {(isOwner || isAdmin) && (
            <MenuItem
              onClick={() => {
                setDeleteDialog(true);
                setMenuAnchor(null);
              }}
              sx={{ gap: 1.5, py: 1, color: "error.main" }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">Sil</Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          maxWidth="xs"
          fullWidth
          disableScrollLock={true}
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Yorumu Sil</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Bu yorumu silmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialog(false)}
              sx={{ textTransform: "none" }}
            >
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                onDelete(comment._id);
                setDeleteDialog(false);
              }}
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
            >
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default CommentItem;
