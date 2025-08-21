import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "../../redux/commentSlice";
import CommentItem from "./CommentItem";
import { alpha } from "@mui/material/styles";
import CommentIcon from "@mui/icons-material/Comment";
import SortIcon from "@mui/icons-material/Sort";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.user.currentUser);
  const { items: flatComments, loading } = useSelector(
    (state) => state.comments
  );

  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    if (postId) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment = {
      user: user.id,
      postId,
      text,
    };

    try {
      await dispatch(addComment(newComment));
      setText("");
      setSnackbar({ open: true, message: "Yorum eklendi" });
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
    }
  };

  const handleReplySubmit = async (parentId, replyObj) => {
    const newReply = {
      user: replyObj.user,
      postId,
      parentId,
      text: replyObj.text,
    };

    try {
      await dispatch(addComment(newReply));
      setSnackbar({ open: true, message: "Yanıt eklendi" });
    } catch (err) {
      console.error("Yanıt eklenemedi:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteComment(id));
      setSnackbar({ open: true, message: "Yorum silindi" });
    } catch (err) {
      console.error("Silme başarısız:", err);
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const buildNestedComments = (comments) => {
    const map = {};
    comments.forEach((c) => (map[c._id] = { ...c, replies: [] }));
    const nested = [];
    comments.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        nested.push(map[c._id]);
      }
    });
    return nested;
  };

  const sortedComments = useMemo(() => {
    const nested = buildNestedComments(flatComments);
    return nested.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortOrder === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortOrder === "mostLiked") {
        const aLikes = a.likes?.length || 0;
        const bLikes = b.likes?.length || 0;
        return bLikes - aLikes;
      }
      return 0;
    });
  }, [flatComments, sortOrder]);

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header with Comment Count and Sort */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: (theme) =>
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
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <CommentIcon sx={{ fontSize: 24, color: "primary.main" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                Yorumlar
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary" }}
              >{`${flatComments.length} yorum`}</Typography>
            </Box>
          </Box>

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            startAdornment={
              <SortIcon sx={{ ml: 1, mr: 0.5, color: "text.secondary" }} />
            }
            sx={{
              minWidth: 180,
              "& .MuiSelect-select": {
                py: 1,
                pl: 1,
              },
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
            }}
          >
            <MenuItem value="newest">En Yeni</MenuItem>
            <MenuItem value="oldest">En Eski</MenuItem>
            <MenuItem value="mostLiked">En Çok Beğenilenler</MenuItem>
          </Select>
        </Box>
      </Paper>

      {/* Comments List */}
      <List sx={{ py: 0 }}>
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReplySubmit={handleReplySubmit}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onDelete={handleDelete}
            onNotify={showSnackbar}
          />
        ))}
      </List>

      {/* Login Prompt or Comment Form */}
      {!user ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ mb: 2, color: "text.secondary" }}>
            Yorum yapabilmek için giriş yapmalısınız
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Giriş Yap
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Yorum Yaz
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Düşüncelerinizi paylaşın..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.6),
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!text.trim()}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Yorumu Gönder
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentSection;
