import React, { useState, useEffect } from "react";
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
import axios from "axios";
import CommentItem from "./CommentItem";
import { useAuth } from "../contexts/AuthContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const theme = useTheme();
  const { user } = useAuth();

  // Yorumları çek
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/comments?postId=${postId}`
      );
      const tree = buildNestedComments(res.data);
      setComments(tree);
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
    }
  };

  const buildNestedComments = (flatComments) => {
    const map = {};
    flatComments.forEach((c) => (map[c._id] = { ...c, replies: [] }));
    const nested = [];
    flatComments.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        nested.push(map[c._id]);
      }
    });
    return nested;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const payload = {
      postId,
      username: user.username,
      email: user.email,
      text,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        "https://materialblog-server-production.up.railway.app/api/comments",
        payload
      );
      await fetchComments();
      setText("");
      setSnackbar({ open: true, message: "Yorum eklendi" });
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
    }
  };

  const handleReplySubmit = async (parentId, replyObj) => {
    const payload = {
      ...replyObj,
      postId,
      parentId,
    };

    try {
      await axios.post(
        "https://materialblog-server-production.up.railway.app/api/comments",
        payload
      );
      await fetchComments();
      setSnackbar({ open: true, message: "Yanıt eklendi" });
    } catch (err) {
      console.error("Yanıt eklenemedi:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://materialblog-server-production.up.railway.app/api/comments/${id}`
      );
      await fetchComments();
      setSnackbar({ open: true, message: "Yorum silindi" });
    } catch (err) {
      console.error("Silme başarısız:", err);
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOrder === "mostLiked") {
      const aCount = a.likes?.length || 0;
      const bCount = b.likes?.length || 0;
      return bCount - aCount;
    }
    return 0;
  });

  return (
    <Box sx={{ mt: 4 }}>
      {/* Başlık ve sıralama */}
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

      {/* Yorum listesi */}
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

      {/* Yorum formu */}
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
