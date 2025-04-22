import React, { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  MenuItem,
} from "@mui/material";

const initialState = {
  title: "",
  summary: "",
  content: "",
  category: "",
  tags: "",
};

const categories = ["React", "JavaScript", "Tasarım"];

const PostForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const newPost = {
      ...formData,
      id: Date.now(),
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      date: new Date().toISOString().split("T")[0],
    };

    const currentPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedPosts = [newPost, ...currentPosts];
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    if (onSubmit) onSubmit(newPost);
    setFormData(initialState);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Yeni Yazı Ekle
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2 }}
      >
        <TextField
          label="Başlık"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Özet"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="İçerik"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={6}
          fullWidth
        />
        <TextField
          select
          label="Kategori"
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Etiketler (virgülle ayır)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          fullWidth
        />
        <Button variant="contained" type="submit">
          Kaydet
        </Button>
      </Box>
    </Paper>
  );
};

export default PostForm;
