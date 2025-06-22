import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      image: function () {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          const formData = new FormData();
          formData.append("image", file);
          try {
            const res = await axios.post(
              "https://materialblog-server-production.up.railway.app/api/upload",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            const url = res.data.url;
            const range = this.quill.getSelection();
            this.quill.insertEmbed(range.index, "image", url);
          } catch (err) {
            console.error("Görsel yüklenemedi:", err);
          }
        };
      },
    },
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
];

const PostEditorPage = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    summary: "",
    content: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(stored);
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(
          `https://materialblog-server-production.up.railway.app/api/posts/${id}`
        )
        .then((res) => {
          const post = res.data;
          setForm({
            title: post.title || "",
            category: post.category || "",
            image: post.image || "",
            summary: post.summary || "",
            content: post.content || "",
            tags: (post.tags || []).join(", "),
          });
        })
        .catch((err) => {
          console.error("Yazı getirilemedi:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()),
    };
    try {
      if (id) {
        await axios.put(
          `https://materialblog-server-production.up.railway.app/${id}`,
          payload
        );
        setSnackbar({
          open: true,
          message: "Yazı güncellendi!",
          severity: "success",
        });
      } else {
        await axios.post(
          "https://materialblog-server-production.up.railway.app/api/posts",
          payload
        );
        setSnackbar({
          open: true,
          message: "Yazı oluşturuldu!",
          severity: "success",
        });
      }
      setTimeout(() => navigate("/admin/posts"), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "İşlem başarısız",
        severity: "error",
      });
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        "https://materialblog-server-production.up.railway.app/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setForm({ ...form, image: res.data.url });
    } catch (err) {
      console.error("Kapak görseli yüklenemedi:", err);
    }
  };

  if (loading) return <Typography>Yükleniyor...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
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
              {categories.map((cat, i) => (
                <MenuItem key={i} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Kapak Görseli:</Typography>
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Görsel Yükle
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleCoverUpload}
              />
            </Button>
            {form.image && (
              <Box mt={2}>
                <img
                  src={form.image}
                  alt="Kapak Görseli"
                  style={{
                    maxHeight: 150,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Özet"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            İçerik:
          </Typography>
          <ReactQuill
            value={form.content || ""}
            onChange={(value) => setForm({ ...form, content: value })}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />

          <TextField
            fullWidth
            label="Etiketler (virgülle)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            sx={{ mb: 3, mt: 3 }}
          />

          <Button variant="contained" type="submit">
            Gönder
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostEditorPage;
