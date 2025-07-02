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
} from "../redux/commentSlice";
import CommentItem from "./CommentItem";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
        >
          Yorumlar
        </Typography>

        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          size="small"
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
            borderRadius: 1,
          }}
        >
          <MenuItem value="newest">En Yeni</MenuItem>
          <MenuItem value="oldest">En Eski</MenuItem>
          <MenuItem value="mostLiked">En Çok Beğenilenler</MenuItem>
        </Select>
      </Box>

      <List>
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

      <Divider sx={{ my: 3 }} />

      {!user ? (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Yorum yapabilmek için{" "}
            <Link to="/login" style={{ color: theme.palette.primary.main }}>
              giriş yapmalısınız.
            </Link>
          </Typography>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 2,
            bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[300]
            }`,
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Yeni Yorum Yaz
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Yorum yazın"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              multiline
              rows={3}
              size="small"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Gönder
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
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentSection;
