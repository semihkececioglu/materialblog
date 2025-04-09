// CommentSection.js
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
} from "@mui/material";
import CommentItem from "./CommentItem";
import { useAuth } from "../contexts/AuthContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
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
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
      }));
      setComments(fixed);
    }
  }, [storageKey]);

  const saveComments = (updated) => {
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const commenterName = user ? user.name : name;
    if (!commenterName.trim() || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      name: commenterName,
      text,
      avatar: user ? `https://i.pravatar.cc/150?u=${user.name}` : null,
      date: new Date().toISOString(),
      replies: [],
      likes: 0,
      dislikes: 0,
      userId: commenterName,
    };

    const updated = [...comments, newComment];
    saveComments(updated);
    setName("");
    setText("");
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
    saveComments(addReplyRecursively(comments));
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
    saveComments(deleteRecursively(comments));
  };

  const handleUpdate = (id, updatedText) => {
    const updateRecursively = (items) =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, text: updatedText };
        }
        return {
          ...item,
          replies: updateRecursively(item.replies || []),
        };
      });
    saveComments(updateRecursively(comments));
  };

  const getUpdatedComment = (comment) => ({
    ...comment,
    likes:
      parseInt(localStorage.getItem(`likes_${comment.id}`)) ||
      comment.likes ||
      0,
    dislikes:
      parseInt(localStorage.getItem(`dislikes_${comment.id}`)) ||
      comment.dislikes ||
      0,
    replies: comment.replies?.map(getUpdatedComment) || [],
  });

  const updatedComments = comments.map(getUpdatedComment);

  const sortedComments = [...updatedComments].sort((a, b) => {
    if (sortOrder === "mostLiked") return b.likes - a.likes;
    return sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" gutterBottom>
        Yorumlar
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
          <MenuItem value="mostLiked">En Beğenilen</MenuItem>
        </Select>
      </Box>

      <List>
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplySubmit={handleReplySubmit}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            currentUser={user}
          />
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[300]
          }`,
          boxShadow: theme.palette.mode === "dark" ? 4 : 2,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Yeni Yorum Yaz
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Kullanıcı Adı"
              fullWidth
              value={user ? user.name : name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!user}
            />
            <TextField
              label="Yorum yazın"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              multiline
              rows={4}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">
                Gönder
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CommentSection;
