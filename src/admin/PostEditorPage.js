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
import { BASE_URL } from "../config"; // backend API için
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

// ✅ Cloudinary’ye direkt yükleme fonksiyonu
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "materialblog"); // Cloudinary’de oluşturduğun unsigned preset adı
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/da2mjic2e/image/upload", // kendi cloud_name ile değiştir
    formData
  );
  return res.data.secure_url;
};

// ✅ Quill ayarları
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
          if (!file) return;
          try {
            const url = await uploadToCloudinary(file);
            const range = this.quill.getSelection();
            this.quill.insertEmbed(range.index, "image", url);
          } catch (err) {
            console.error("İçerik görseli yüklenemedi:", err);
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data.map((c) => c.name)))
      .catch((err) => console.error("Kategori alınamadı:", err));
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/api/posts/${id}`)
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
        .catch((err) => console.error("Yazı çekilemedi:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      setForm({ ...form, image: url });
    } catch (err) {
      console.error("Kapak görseli yüklenemedi:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()),
    };
    try {
      if (id) {
        await axios.put(`${BASE_URL}/api/posts/${id}`, payload);
        setSnackbar({
          open: true,
          message: "Yazı güncellendi!",
          severity: "success",
        });
      } else {
        await axios.post(`${BASE_URL}/api/posts`, payload);
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
                  alt="Kapak"
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
            multiline
            minRows={3}
            label="Özet"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            İçerik:
          </Typography>
          <ReactQuill
            value={form.content}
            onChange={(val) => setForm({ ...form, content: val })}
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
            sx={{ my: 3 }}
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
