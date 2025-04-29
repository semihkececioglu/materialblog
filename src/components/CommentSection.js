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
import CommentItem from "./CommentItem";
import { useAuth } from "../contexts/AuthContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const theme = useTheme();
  const { user } = useAuth();

  const storageKey = `comments_${postId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      const fixed = parsed.map((c) => ({
        ...c,
        replies: c.replies || [],
      }));
      setComments(fixed);
    }
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const commenterName = user ? user.name : name;
    const commenterEmail = user ? user.email : email;
    if (!commenterName.trim() || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      name: commenterName,
      email: commenterEmail,
      text,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(
        Math.random() * 1000
      )}`,
      date: new Date().toISOString(),
      replies: [],
    };

    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setName("");
    setEmail("");
    setText("");
    setSnackbar({ open: true, message: "Yorum eklendi" });
  };

  const handleReplySubmit = (parentId, replyObj) => {
    const addReplyRecursively = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          return { ...item, replies: [...item.replies, replyObj] };
        }
        return {
          ...item,
          replies: addReplyRecursively(item.replies || []),
        };
      });
    };

    const updated = addReplyRecursively(comments);
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const deleteRecursively = (items) => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          replies: deleteRecursively(item.replies || []),
        }));
    };

    const updated = deleteRecursively(comments);
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
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
      const aCount =
        JSON.parse(localStorage.getItem(`comment_count_${a.id}`)) || 0;
      const bCount =
        JSON.parse(localStorage.getItem(`comment_count_${b.id}`)) || 0;
      return bCount - aCount;
    }
    return 0;
  });

  return (
    <Box sx={{ mt: 4 }}>
      {/* Yorumlar Başlığı ve Sıralama */}
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
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
          }}
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

      {/* Yorumlar Listesi */}
      <List>
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
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

      {/* Yorum Ekleme Formu */}
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
          {!user && (
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Ad Soyad"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
              />
              <TextField
                label="E-posta"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
              />
            </Box>
          )}
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

      {/* Snackbar */}
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
