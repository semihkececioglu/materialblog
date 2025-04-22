import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const PostForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    id: initialData?.id || Date.now(),
    title: initialData?.title || "",
    category: initialData?.category || "",
    content: initialData?.content || "",
    summary: initialData?.summary || "",
    tags: initialData?.tags?.join(", ") || "",
    date: initialData?.date || new Date().toISOString().slice(0, 10),
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(storedCategories);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const post = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()),
    };

    onSubmit(post);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Başlık"
        name="title"
        value={form.title}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Kategori</InputLabel>
        <Select
          name="category"
          value={form.category}
          onChange={handleChange}
          label="Kategori"
        >
          {categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Özet"
        name="summary"
        value={form.summary}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        multiline
        minRows={10}
        label="İçerik"
        name="content"
        value={form.content}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Etiketler (virgülle)"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" type="submit">
        Kaydet
      </Button>
    </Box>
  );
};

export default PostForm;
