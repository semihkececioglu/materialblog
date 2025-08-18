import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  clearSelectedPost,
  createPost,
  updatePost,
} from "../redux/postSlice";

Quill.register("modules/imageResize", ImageResize);

// 🔧 Cloudinary upload
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "materialblog"); // senin preset adın
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/da2mjic2e/image/upload",
    formData
  );
  return res.data.secure_url;
};

// 🔧 Quill toolbar
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
            // 🔁 optimize edilmiş versiyonu kullan
            const optimized = url.includes("/image/upload/")
              ? url.replace(
                  "/image/upload/",
                  "/image/upload/f_auto,q_auto,c_limit,w_1200/"
                )
              : url;
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, "image", optimized, "user");
            this.quill.setSelection(range.index + 1, 0, "user");
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.user.currentUser);

  const loading = useSelector((state) => state.posts.loading);

  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    _imagePreview: "",
    summary: "",
    content: "",
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    import("react-quill/dist/quill.snow.css");
  }, []);

  // Kategori ve etiketleri al
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data.map((c) => c.name)))
      .catch((err) => console.error("Kategori alınamadı:", err));

    axios
      .get(`${BASE_URL}/api/tags`)
      .then((res) => setAllTags(res.data))
      .catch((err) => console.error("Etiketler alınamadı:", err));
  }, []);

  // Düzenlenecek postu al
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const post = await dispatch(fetchPostById(id)).unwrap();
          setForm({
            title: post.title || "",
            category: post.category || "",
            image: post.image || "",
            _imagePreview: post.image
              ? post.image.replace(
                  "/image/upload/",
                  "/image/upload/f_auto,q_auto,c_limit,w_800/"
                )
              : "",
            summary: post.summary || "",
            content: post.content || "",
            tags: post.tags || [],
          });
        } catch (err) {
          console.error("Yazı alınamadı:", err);
        }
      } else {
        setForm({
          title: "",
          category: "",
          image: "",
          _imagePreview: "",
          summary: "",
          content: "",
          tags: [],
        });
      }
    };

    fetchData();

    return () => dispatch(clearSelectedPost());
  }, [id, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kapak görseli yükleme
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsCoverUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      const preview = url.includes("/image/upload/")
        ? url.replace(
            "/image/upload/",
            "/image/upload/f_auto,q_auto,c_limit,w_800/"
          )
        : url;
      setForm({ ...form, image: url, _imagePreview: preview });
    } catch (err) {
      console.error("Kapak görseli yüklenemedi:", err);
    } finally {
      setIsCoverUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Yeni etiketleri DB'ye kaydet
    for (const tag of form.tags) {
      const exists = allTags.some(
        (t) => t.name.toLowerCase() === tag.toLowerCase()
      );
      if (!exists) {
        try {
          await axios.post(`${BASE_URL}/api/tags`, { name: tag });
        } catch (err) {
          console.error("Yeni etiket eklenemedi:", err);
        }
      }
    }

    const payload = {
      ...form,
      tags: form.tags.map((t) => t.trim()),
      user: user?._id,
    };

    try {
      if (id) {
        await dispatch(updatePost({ id, updatedPost: payload })).unwrap();
        setSnackbar({
          open: true,
          message: "Yazı güncellendi!",
          severity: "success",
        });
      } else {
        await dispatch(createPost(payload)).unwrap();
        setSnackbar({
          open: true,
          message: "Yazı oluşturuldu!",
          severity: "success",
        });
      }

      setTimeout(() => navigate("/admin/posts"), 1500);
    } catch (err) {
      console.error("Gönderim hatası:", err);
      setSnackbar({
        open: true,
        message: "İşlem başarısız",
        severity: "error",
      });
    }
  };

  if (loading || (id && form.title === "")) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 3,
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        {id ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
      </Typography>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
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

          {/* Kapak Görseli */}
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

            {isCoverUploading ? (
              <Box mt={2} display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              form._imagePreview && (
                <Box
                  mt={2}
                  sx={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={form._imagePreview}
                    alt="Kapak"
                    style={{
                      maxHeight: 150,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                  {/* X ikonu */}
                  <Button
                    size="small"
                    onClick={() =>
                      setForm({ ...form, image: "", _imagePreview: "" })
                    }
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      minWidth: 0,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    ✕
                  </Button>
                </Box>
              )
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
            style={{
              height: "300px",
              marginBottom: "50px",
              backgroundColor: "#fff",
              borderRadius: 8,
            }}
          />

          <Autocomplete
            multiple
            freeSolo
            options={allTags.map((tag) => tag.name)}
            value={form.tags}
            onChange={(e, newValue) => setForm({ ...form, tags: newValue })}
            renderInput={(params) => (
              <TextField {...params} label="Etiketler" sx={{ my: 3 }} />
            )}
          />

          <Button variant="contained" type="submit" sx={{ borderRadius: 2 }}>
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
