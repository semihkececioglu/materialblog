import React, { useState, useEffect, Suspense } from "react";
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
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import useLazyCss from "../hooks/useLazyCss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  clearSelectedPost,
  createPost,
  updatePost,
} from "../redux/postSlice";

// ✅ ReactQuill lazy import
const ReactQuill = React.lazy(() => import("react-quill"));

// ✅ Cloudinary upload
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "materialblog");
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/da2mjic2e/image/upload",
    formData
  );
  return res.data.secure_url;
};

// ✅ Formats
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

  // 🔽 Quill modules
  const [quillModules, setQuillModules] = useState(null);

  // ✅ Quill CSS’i global olarak yükle
  useLazyCss(() => import("react-quill/dist/quill.snow.css"));

  // Kategoriler & Etiketler
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

  // ✅ Quill + imageResize dinamik import
  useEffect(() => {
    let mounted = true;

    const loadEditor = async () => {
      const [{ default: Quill }, { default: ImageResize }] = await Promise.all([
        import("quill"),
        import("quill-image-resize-module-react"),
      ]);

      Quill.register("modules/imageResize", ImageResize);

      // Custom image upload handler
      const imageHandler = function () {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files && input.files[0];
          if (!file) return;
          try {
            const url = await uploadToCloudinary(file);
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
      };

      if (!mounted) return;

      setQuillModules({
        toolbar: {
          container: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            ["clean"],
          ],
          handlers: { image: imageHandler },
        },
        imageResize: {
          parchment: Quill.import("parchment"),
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
      });
    };

    loadEditor();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kapak görseli yükleme
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
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

    // Yeni etiketleri ekle
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          px: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/posts")}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          Geri
        </Button>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {id ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Başlık ve Kategori Grid */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <TextField
              fullWidth
              label="Başlık"
              name="title"
              value={form.title}
              onChange={handleChange}
              sx={{
                flex: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.6),
                },
              }}
            />

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Kategori</InputLabel>
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                label="Kategori"
                sx={{
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.6),
                }}
              >
                {categories.map((cat, i) => (
                  <MenuItem key={i} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Kapak Görseli */}
          <Box
            sx={{
              p: 3,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.3),
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Kapak Görseli
            </Typography>

            {!form._imagePreview && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Görsel Yükle
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverUpload}
                />
              </Button>
            )}

            {isCoverUploading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              form._imagePreview && (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={form._imagePreview}
                    alt="Kapak"
                    style={{
                      maxWidth: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() =>
                      setForm({ ...form, image: "", _imagePreview: "" })
                    }
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )
            )}
          </Box>

          {/* Özet */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            label="Özet"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
              },
            }}
          />

          {/* İçerik Editörü */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              İçerik
            </Typography>

            <Suspense
              fallback={
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              {quillModules ? (
                <Box
                  sx={{
                    ".ql-container": {
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      bgcolor: "background.paper",
                    },
                    ".ql-toolbar": {
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      bgcolor: "background.paper",
                    },
                    ".ql-editor": {
                      minHeight: 400,
                    },
                  }}
                >
                  <ReactQuill
                    value={form.content}
                    onChange={(val) => setForm({ ...form, content: val })}
                    modules={quillModules}
                    formats={quillFormats}
                    theme="snow"
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Suspense>
          </Box>

          {/* Etiketler */}
          <Autocomplete
            multiple
            freeSolo
            options={allTags.map((tag) => tag.name)}
            value={form.tags}
            onChange={(e, newValue) => setForm({ ...form, tags: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Etiketler"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      alpha(theme.palette.background.paper, 0.6),
                  },
                }}
              />
            )}
          />

          {/* Submit Button */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/posts")}
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: "none",
              }}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: "none",
              }}
            >
              {id ? "Güncelle" : "Yayınla"}
            </Button>
          </Box>
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
