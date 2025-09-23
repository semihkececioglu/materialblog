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
  Card,
  CardContent,
  Divider,
  Fade,
  Zoom,
  Stack,
  Tooltip,
  LinearProgress,
  Autocomplete,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Paper,
  InputAdornment,
  Skeleton,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Badge,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import useLazyCss from "../hooks/useLazyCss";

// Modern Icons - Same as AdminPostsPage
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import ArticleIcon from "@mui/icons-material/Article";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InfoIcon from "@mui/icons-material/Info";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { alpha, darken } from "@mui/material/styles";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  clearSelectedPost,
  createPost,
  updatePost,
} from "../redux/postSlice";

// ReactQuill lazy import
const ReactQuill = React.lazy(() => import("react-quill"));

// Constants from AdminPostsPage
const CONTROL_H = 42;

// Cloudinary upload
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

// Word count helper
const getWordCount = (text) => {
  if (!text) return 0;
  const plainText = text.replace(/<[^>]*>/g, "").trim();
  return plainText ? plainText.split(/\s+/).length : 0;
};

// Character count helper
const getCharCount = (text) => {
  return text ? text.trim().length : 0;
};

// Preview Dialog Component
const PreviewDialog = ({ open, onClose, post, categories = [] }) => {
  if (!post.title && !post.content) return null;

  // Kategori adını güvenli şekilde al
  const getCategoryName = () => {
    if (!post.category) return "Kategorisiz";

    // Eğer string ID ise
    if (typeof post.category === "string") {
      const found = categories.find((c) => c._id === post.category);
      return found?.name || "Kategorisiz";
    }

    // Eğer obje ise
    if (typeof post.category === "object" && post.category?.name) {
      return post.category.name;
    }

    return "Kategorisiz";
  };

  const categoryName = getCategoryName();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Yazı Önizlemesi
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          {post.image && (
            <Box
              sx={{
                width: "100%",
                height: 200,
                borderRadius: 3,
                overflow: "hidden",
                mb: 3,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              <img
                src={post.image}
                alt="Kapak"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            {post.title || "Başlık girilmedi"}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {post.category && (
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  bgcolor: post.category?.color
                    ? alpha(post.category.color, 0.1)
                    : "#f5f5f5",
                  color: post.category?.color || "#333",
                  fontWeight: 600,
                }}
              />
            )}
            {/* PreviewDialog içindeki tags render'ı */}
            {Array.isArray(post.tags) &&
              post.tags.map((tag, i) => {
                const tagName = typeof tag === "string" ? tag : tag.name;
                const tagKey =
                  typeof tag === "string" ? `preview-${tag}` : tag._id;

                return (
                  <Chip
                    key={tagKey}
                    label={tagName || "Etiketsiz"}
                    size="small"
                    variant="outlined"
                  />
                );
              })}
          </Stack>

          {post.summary && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 3, fontStyle: "italic" }}
            >
              {post.summary}
            </Typography>
          )}

          <Box
            sx={{
              "& p": { mb: 2 },
              "& h1, & h2, & h3": { mb: 2, mt: 3 },
              "& img": { maxWidth: "100%", borderRadius: 2 },
              "& blockquote": {
                borderLeft: 4,
                borderColor: "primary.main",
                pl: 2,
                py: 1,
                bgcolor: "grey.50",
                borderRadius: 1,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: post.content || "<p>İçerik girilmedi</p>",
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const PostEditorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [touched, setTouched] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tagInputValue, setTagInputValue] = useState("");

  // Quill modules
  const [quillModules, setQuillModules] = useState(null);

  // Quill CSS'i global olarak yükle
  useLazyCss(() => import("react-quill/dist/quill.snow.css"));

  // Form validation
  const validationRules = {
    title: {
      required: true,
      minLength: 10,
      maxLength: 60,
      message: "Başlık 10-60 karakter arası olmalıdır",
    },
    category: {
      required: true,
      message: "Kategori seçilmelidir",
    },
    summary: {
      required: true,
      minLength: 50,
      maxLength: 160,
      message: "Özet 50-160 karakter arası olmalıdır",
    },
    content: {
      required: true,
      minLength: 100,
      message: "İçerik en az 100 karakter olmalıdır",
    },
  };

  const validateField = (field, value) => {
    const rule = validationRules[field];
    if (!rule) return { isValid: true };

    if (rule.required && (!value || value.trim() === "")) {
      return {
        isValid: false,
        message: `${
          field === "title"
            ? "Başlık"
            : field === "category"
            ? "Kategori"
            : field === "summary"
            ? "Özet"
            : "İçerik"
        } zorunludur`,
      };
    }

    const length =
      field === "content" ? getWordCount(value) : getCharCount(value);

    if (rule.minLength && length < rule.minLength) {
      return { isValid: false, message: rule.message };
    }

    if (rule.maxLength && length > rule.maxLength) {
      return { isValid: false, message: rule.message };
    }

    return { isValid: true };
  };

  const getFieldValidation = (field) => {
    const value = form[field];
    const validation = validateField(field, value);
    const isTouched = touched[field];

    return {
      ...validation,
      showError: isTouched && !validation.isValid,
    };
  };

  // Kategoriler & Etiketler
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
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
          console.log("Post verisi:", post); // Debug için
          console.log("Post tags:", post.tags); // Debug için

          setForm({
            title: post.title || "",
            category: post.category?._id || "",
            image: post.image || "",
            _imagePreview: post.image
              ? post.image.replace(
                  "/image/upload/",
                  "/image/upload/f_auto,q_auto,c_limit,w_800/"
                )
              : "",
            summary: post.summary || "",
            content: post.content || "",
            tags: post.tags || [], // ✅ Backend'den gelen tag objeleri
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

  // Quill + imageResize dinamik import
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Mark field as touched
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
  };

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  // Kapak görseli yükleme
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCoverUploading(true);
    setUploadProgress(0);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const url = await uploadToCloudinary(file);
      const preview = url.includes("/image/upload/")
        ? url.replace(
            "/image/upload/",
            "/image/upload/f_auto,q_auto,c_limit,w_800/"
          )
        : url;
      setForm({ ...form, image: url, _imagePreview: preview });
      setUploadProgress(100);
    } catch (err) {
      console.error("Kapak görseli yüklenemedi:", err);
      setSnackbar({
        open: true,
        message: "Görsel yükleme başarısız",
        severity: "error",
      });
    } finally {
      clearInterval(progressTimer);
      setTimeout(() => {
        setIsCoverUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // ✅ Yeni tag ekleme helper
  const handleAddTag = async (rawName) => {
    const name = rawName.trim();
    if (!name) return;

    // Zaten varsa tekrar ekleme
    const existing = allTags.find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      if (!form.tags.some((t) => t._id === existing._id)) {
        setForm({ ...form, tags: [...form.tags, existing] });
      }
      setTagInputValue("");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/tags`, { name });
      setAllTags((prev) => [...prev, res.data]);
      setForm({ ...form, tags: [...form.tags, res.data] });
      setSnackbar({
        open: true,
        message: "Etiket eklendi",
        severity: "success",
      });
    } catch (err) {
      console.error("Etiket oluşturulamadı:", err);
      setSnackbar({
        open: true,
        message: "Etiket eklenemedi",
        severity: "error",
      });
    } finally {
      setTagInputValue("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all required fields
    const validations = Object.keys(validationRules).map((field) =>
      validateField(field, form[field])
    );

    if (validations.some((v) => !v.isValid)) {
      setSnackbar({
        open: true,
        message: "Lütfen tüm zorunlu alanları doğru şekilde doldurun",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // ✅ Yeni etiketleri backend'e ekle
    const processedTags = [];

    for (const tag of form.tags) {
      if (typeof tag === "string") {
        // Yeni etiket (string olarak gelir)
        try {
          const response = await axios.post(`${BASE_URL}/api/tags`, {
            name: tag,
          });
          processedTags.push(response.data._id);
        } catch (err) {
          console.error("Yeni etiket eklenemedi:", err);
        }
      } else if (tag._id) {
        // Mevcut etiket (obje olarak gelir)
        processedTags.push(tag._id);
      }
    }

    // Etiketler zaten oluşturulmuş (yeni eklenenler Enter ile kaydedildi)
    const payload = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      image: form.image,
      category: form.category, // string id
      tags: form.tags.map((t) => t._id), // sadece id dizisi
      user: user?._id,
    };

    console.log("Gönderilen payload:", JSON.stringify(payload, null, 2));

    try {
      if (id) {
        await dispatch(updatePost({ id, updatedPost: payload })).unwrap();
        setSnackbar({
          open: true,
          message: "Yazı başarıyla güncellendi!",
          severity: "success",
        });
      } else {
        await dispatch(createPost(payload)).unwrap();
        setSnackbar({
          open: true,
          message: "Yazı başarıyla oluşturuldu!",
          severity: "success",
        });
      }
      setTimeout(() => navigate("/admin/posts"), 1500);
    } catch (err) {
      console.error("Gönderim hatası:", err);
      setSnackbar({
        open: true,
        message: "İşlem başarısız. Lütfen tekrar deneyin.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (id && form.title === "")) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Paper
          elevation={0}
          sx={(t) => ({
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            background: alpha(t.palette.background.paper, 0.9),
            border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
          })}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Skeleton variant="circular" width={64} height={64} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" height={24} />
              </Box>
            </Stack>
            <Divider />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={60} />
            ))}
          </Stack>
        </Paper>
      </Container>
    );
  }

  const wordCount = getWordCount(form.content);
  const titleValidation = getFieldValidation("title");
  const categoryValidation = getFieldValidation("category");
  const summaryValidation = getFieldValidation("summary");
  const contentValidation = getFieldValidation("content");

  const isFormValid =
    titleValidation.isValid &&
    categoryValidation.isValid &&
    summaryValidation.isValid &&
    contentValidation.isValid;

  // Calculate completion percentage
  const completedFields = [
    !!form.title && titleValidation.isValid,
    !!form.category && categoryValidation.isValid,
    !!form.summary && summaryValidation.isValid,
    !!form.content && contentValidation.isValid,
    !!form.image, // Optional but counts for completion
  ];
  const completionPercentage = Math.round(
    (completedFields.filter(Boolean).length / completedFields.length) * 100
  );

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 4, md: 5 }, position: "relative" }}
    >
      {/* Enhanced Background - Same as AdminPostsPage */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (t) =>
            t.palette.mode === "dark"
              ? `radial-gradient(circle at 25% 18%, ${alpha(
                  t.palette.primary.main,
                  0.15
                )}, transparent 60%), 
                 radial-gradient(circle at 75% 80%, ${alpha(
                   t.palette.secondary.main,
                   0.12
                 )}, transparent 60%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.default
                })`
              : `radial-gradient(circle at 25% 18%, ${alpha(
                  t.palette.primary.light,
                  0.4
                )}, transparent 65%), 
                 radial-gradient(circle at 75% 80%, ${alpha(
                   t.palette.secondary.light,
                   0.3
                 )}, transparent 65%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.paper
                })`,
        }}
      />

      {/* Header - Same style as AdminPostsPage */}
      <Paper
        elevation={0}
        sx={(t) => ({
          mb: 4,
          p: 4,
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          backdropFilter: "blur(20px)",
          background:
            t.palette.mode === "dark"
              ? `linear-gradient(145deg, ${alpha(
                  t.palette.background.paper,
                  0.9
                )}, ${alpha(t.palette.background.default, 0.95)})`
              : `linear-gradient(145deg, ${alpha("#fff", 0.95)}, ${alpha(
                  "#f8fafc",
                  0.9
                )})`,
          border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 30% 20%, ${alpha(
              t.palette.primary.main,
              0.08
            )} 0%, transparent 50%), 
                         radial-gradient(circle at 80% 80%, ${alpha(
                           t.palette.secondary.main,
                           0.06
                         )} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        })}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Title Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <IconButton
                onClick={() => navigate("/admin/posts")}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  color: "primary.main",
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                  border: (t) =>
                    `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box
                sx={(t) => ({
                  width: 64,
                  height: 64,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                  boxShadow: `0 8px 32px ${alpha(t.palette.primary.main, 0.3)}`,
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: -2,
                    borderRadius: "inherit",
                    padding: 2,
                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    WebkitMaskComposite: "xor",
                    opacity: 0.3,
                  },
                })}
              >
                <EditIcon sx={{ fontSize: 32, color: "white" }} />
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    mb: 1,
                    background: (t) =>
                      `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    letterSpacing: "-1px",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  {id ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Form Tamamlanma: %{completionPercentage}
                    </Typography>
                    {completionPercentage === 100 ? (
                      <CheckCircleIcon
                        sx={{ fontSize: 20, color: "success.main" }}
                      />
                    ) : completionPercentage >= 80 ? (
                      <WarningIcon
                        sx={{ fontSize: 20, color: "warning.main" }}
                      />
                    ) : (
                      <ErrorIcon sx={{ fontSize: 20, color: "error.main" }} />
                    )}
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: (t) => alpha(t.palette.grey[400], 0.2),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background:
                          completionPercentage === 100
                            ? "linear-gradient(90deg, #4CAF50, #8BC34A)"
                            : completionPercentage >= 80
                            ? "linear-gradient(90deg, #FF9800, #FFC107)"
                            : "linear-gradient(90deg, #2196F3, #03A9F4)",
                      },
                    }}
                  />
                </Box>

                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  <Chip
                    icon={<ArticleIcon sx={{ fontSize: 18 }} />}
                    label={`${wordCount} kelime`}
                    size="small"
                    sx={{
                      height: 32,
                      fontWeight: 600,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                      color: "primary.main",
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />

                  {form.category && (
                    <Chip
                      icon={<CategoryIcon sx={{ fontSize: 18 }} />}
                      label={(() => {
                        // Debug için
                        console.log("Header kategori:", form.category);

                        if (!form.category) return "Kategorisiz";

                        if (typeof form.category === "string") {
                          const found = categories.find(
                            (c) => c._id === form.category
                          );
                          return found?.name || "Kategorisiz";
                        }

                        if (
                          typeof form.category === "object" &&
                          form.category !== null
                        ) {
                          return form.category.name || "Kategorisiz";
                        }

                        return "Kategorisiz";
                      })()}
                      size="small"
                      sx={{
                        height: 32,
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.secondary.main, 0.15),
                        color: "secondary.main",
                        "& .MuiChip-label": { px: 1.5 },
                      }}
                    />
                  )}

                  {/* Header'daki tags chip'i */}
                  {form.tags.length > 0 && (
                    <Chip
                      icon={<LocalOfferIcon sx={{ fontSize: 18 }} />}
                      label={`${form.tags.length} etiket`}
                      size="small"
                      sx={{
                        height: 32,
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.info.main, 0.15),
                        color: "info.main",
                        "& .MuiChip-label": { px: 1.5 },
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={() => setPreviewOpen(true)}
                disabled={!form.title && !form.content}
                sx={(t) => ({
                  height: CONTROL_H,
                  borderRadius: 4,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  px: 3,
                  background: `linear-gradient(135deg, ${
                    t.palette.primary.main
                  }, ${darken(t.palette.primary.main, 0.2)})`,
                  boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${alpha(
                      t.palette.primary.main,
                      0.4
                    )}`,
                  },
                  "&:disabled": {
                    background: (t) => alpha(t.palette.text.secondary, 0.3),
                    color: (t) => alpha(t.palette.text.secondary, 0.5),
                    boxShadow: "none",
                  },
                  transition: "all 0.3s ease",
                })}
              >
                Canlı Önizle
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={(t) => ({
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: alpha(t.palette.background.paper, 0.9),
          border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
          overflow: "hidden",
        })}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: { xs: 4, md: 6 } }}
        >
          <Stack spacing={5}>
            {/* Basic Info Section */}
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TuneIcon color="primary" />
                Temel Bilgiler
                <Chip
                  label="Zorunlu"
                  size="small"
                  sx={{
                    bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                    color: "error.main",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <TextField
                    fullWidth
                    required
                    label="Başlık"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    placeholder="Yazınızın çekici bir başlığını girin..."
                    error={titleValidation.showError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleIcon
                            sx={{
                              color: titleValidation.showError
                                ? "error.main"
                                : "text.secondary",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="caption"
                            color={
                              getCharCount(form.title) > 60
                                ? "error.main"
                                : "text.secondary"
                            }
                            sx={{ minWidth: 40, textAlign: "right" }}
                          >
                            {getCharCount(form.title)}/60
                          </Typography>
                          <Tooltip
                            title="SEO için 50-60 karakter arası başlık kullanın. Anahtar kelimeleri başta tutun."
                            arrow
                            placement="top"
                          >
                            <InfoIcon
                              sx={{ color: "text.secondary", cursor: "help" }}
                            />
                          </Tooltip>
                        </Stack>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                        borderRadius: 4,
                        bgcolor: (t) =>
                          alpha(t.palette.background.default, 0.6),
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          bgcolor: (t) =>
                            alpha(t.palette.background.default, 0.8),
                        },
                        ...(titleValidation.showError && {
                          borderColor: "error.main",
                          "&:hover": {
                            borderColor: "error.main",
                          },
                        }),
                      },
                    }}
                  />
                  {titleValidation.showError && (
                    <FormHelperText
                      error
                      sx={{
                        mx: 2,
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ErrorIcon sx={{ fontSize: 16 }} />
                      {titleValidation.message}
                    </FormHelperText>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={categoryValidation.showError}>
                      <InputLabel required>Kategori</InputLabel>
                      <Select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        onBlur={() => handleBlur("category")}
                        label="Kategori *"
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon
                              sx={{
                                color: categoryValidation.showError
                                  ? "error.main"
                                  : "text.secondary",
                              }}
                            />
                          </InputAdornment>
                        }
                        sx={{
                          height: 56,
                          borderRadius: 4,
                          bgcolor: (t) =>
                            alpha(t.palette.background.default, 0.6),
                          "&:hover": {
                            bgcolor: (t) =>
                              alpha(t.palette.background.default, 0.8),
                          },
                        }}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: cat.color || "#666",
                                  boxShadow: `0 2px 8px ${alpha(
                                    cat.color || "#666",
                                    0.3
                                  )}`,
                                }}
                              />
                              <Typography variant="body2" fontWeight={500}>
                                {cat.name}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {categoryValidation.showError && (
                        <FormHelperText
                          sx={{
                            mx: 2,
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ErrorIcon sx={{ fontSize: 16 }} />
                          {categoryValidation.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: 2 }}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      minRows={2}
                      maxRows={4}
                      label="Kısa Özet"
                      name="summary"
                      value={form.summary}
                      onChange={handleChange}
                      onBlur={() => handleBlur("summary")}
                      placeholder="Yazınızın kısa bir özetini yazın (150-160 karakter)..."
                      error={summaryValidation.showError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon
                              sx={{
                                color: summaryValidation.showError
                                  ? "error.main"
                                  : "text.secondary",
                                alignSelf: "flex-start",
                                mt: 1,
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            spacing={1}
                            sx={{ mt: 1 }}
                          >
                            <Typography
                              variant="caption"
                              color={
                                getCharCount(form.summary) > 160
                                  ? "error.main"
                                  : "text.secondary"
                              }
                              sx={{ minWidth: 50, textAlign: "right" }}
                            >
                              {getCharCount(form.summary)}/160
                            </Typography>
                            <Tooltip
                              title="Meta açıklama için ideal. Arama sonuçlarında görünür. 150-160 karakter arası olmalı."
                              arrow
                              placement="top"
                            >
                              <InfoIcon
                                sx={{ color: "text.secondary", cursor: "help" }}
                              />
                            </Tooltip>
                          </Stack>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 4,
                          bgcolor: (t) =>
                            alpha(t.palette.background.default, 0.6),
                          "&:hover": {
                            bgcolor: (t) =>
                              alpha(t.palette.background.default, 0.8),
                          },
                        },
                      }}
                    />
                    {summaryValidation.showError && (
                      <FormHelperText
                        error
                        sx={{
                          mx: 2,
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <ErrorIcon sx={{ fontSize: 16 }} />
                        {summaryValidation.message}
                      </FormHelperText>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Divider
              sx={{ borderColor: (t) => alpha(t.palette.divider, 0.1) }}
            />

            {/* Cover Image Section */}
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <ImageIcon color="secondary" />
                Kapak Görseli
                <Chip
                  label="Önerilen"
                  size="small"
                  sx={{
                    bgcolor: (t) => alpha(t.palette.warning.main, 0.1),
                    color: "warning.main",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Typography>

              <Card
                sx={{
                  p: 3,
                  border: "2px dashed",
                  borderColor: form._imagePreview
                    ? "primary.main"
                    : (t) => alpha(t.palette.text.secondary, 0.3),
                  borderRadius: 4,
                  bgcolor: form._imagePreview
                    ? (t) => alpha(t.palette.primary.main, 0.02)
                    : (t) => alpha(t.palette.background.default, 0.3),
                  transition: "all 0.4s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                  },
                }}
              >
                {!form._imagePreview ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                      py: 6,
                    }}
                  >
                    <Box
                      sx={(t) => ({
                        width: 80,
                        height: 80,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                        boxShadow: `0 8px 32px ${alpha(
                          t.palette.primary.main,
                          0.3
                        )}`,
                      })}
                    >
                      <CloudUploadIcon sx={{ fontSize: 40, color: "white" }} />
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Kapak görseli yükleyin
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        1920x1080 çözünürlük önerilir
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PNG, JPG, WEBP formatında (Maks. 5MB)
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={(t) => ({
                        height: CONTROL_H,
                        borderRadius: 4,
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 700,
                        px: 4,
                        background: `linear-gradient(135deg, ${
                          t.palette.primary.main
                        }, ${darken(t.palette.primary.main, 0.2)})`,
                        boxShadow: `0 4px 16px ${alpha(
                          t.palette.primary.main,
                          0.3
                        )}`,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 24px ${alpha(
                            t.palette.primary.main,
                            0.4
                          )}`,
                        },
                        transition: "all 0.3s ease",
                      })}
                    >
                      Görsel Seç
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleCoverUpload}
                      />
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ position: "relative" }}>
                    <Zoom in>
                      <Box
                        sx={{
                          width: "100%",
                          maxHeight: 400,
                          borderRadius: 3,
                          overflow: "hidden",
                          position: "relative",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={form._imagePreview}
                          alt="Kapak"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </Box>
                    </Zoom>
                    <IconButton
                      size="large"
                      onClick={() =>
                        setForm({ ...form, image: "", _imagePreview: "" })
                      }
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.9)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}

                {isCoverUploading && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, textAlign: "center", fontWeight: 600 }}
                    >
                      Yükleniyor... %{uploadProgress}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>

            <Divider
              sx={{ borderColor: (t) => alpha(t.palette.divider, 0.1) }}
            />

            {/* Content Editor */}
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <EditIcon color="info" />
                İçerik Editörü
                <Chip
                  label="Zorunlu"
                  size="small"
                  sx={{
                    bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                    color: "error.main",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Typography>

              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: (t) =>
                    `1px solid ${
                      contentValidation.showError
                        ? t.palette.error.main
                        : alpha(t.palette.divider, 0.2)
                    }`,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        height: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <CircularProgress size={60} thickness={4} />
                      <Typography variant="h6" color="text.secondary">
                        Editör yükleniyor...
                      </Typography>
                    </Box>
                  }
                >
                  {quillModules ? (
                    <Box
                      sx={{
                        ".ql-container": {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          bgcolor: "background.paper",
                          border: "none",
                        },
                        ".ql-toolbar": {
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                          bgcolor: (t) =>
                            alpha(t.palette.background.default, 0.8),
                          borderBottom: (t) =>
                            `2px solid ${alpha(t.palette.divider, 0.1)}`,
                        },
                        ".ql-editor": {
                          minHeight: 500,
                          fontSize: "1.1rem",
                          lineHeight: 1.8,
                          padding: "30px",
                        },
                      }}
                      onBlur={() => handleBlur("content")}
                    >
                      <ReactQuill
                        value={form.content}
                        onChange={(val) => {
                          setForm({ ...form, content: val });
                          if (!touched.content) {
                            setTouched({ ...touched, content: true });
                          }
                        }}
                        modules={quillModules}
                        formats={quillFormats}
                        theme="snow"
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={60} />
                    </Box>
                  )}
                </Suspense>
              </Card>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                  px: 2,
                }}
              >
                {contentValidation.showError ? (
                  <FormHelperText
                    error
                    sx={{ display: "flex", alignItems: "center", gap: 1, m: 0 }}
                  >
                    <ErrorIcon sx={{ fontSize: 16 }} />
                    {contentValidation.message}
                  </FormHelperText>
                ) : (
                  <Box />
                )}
                <Typography
                  variant="caption"
                  color={wordCount < 100 ? "error.main" : "text.secondary"}
                  sx={{ fontWeight: 600 }}
                >
                  {wordCount} kelime {wordCount < 100 && "(minimum 100)"}
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{ borderColor: (t) => alpha(t.palette.divider, 0.1) }}
            />

            {/* Tags Section */}
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <LocalOfferIcon color="warning" />
                Etiketler
                <Chip
                  label="İsteğe Bağlı"
                  size="small"
                  sx={{
                    bgcolor: (t) => alpha(t.palette.info.main, 0.1),
                    color: "info.main",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
                {form.tags.length > 0 && (
                  <Chip
                    label={`${form.tags.length} seçili`}
                    size="small"
                    sx={{
                      bgcolor: (t) => alpha(t.palette.success.main, 0.1),
                      color: "success.main",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: (t) => alpha(t.palette.background.default, 0.4),
                  border: (t) => `1px solid ${alpha(t.palette.divider, 0.1)}`,
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.background.default, 0.6),
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {/* Seçili Etiketler */}
                {form.tags.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{
                        mb: 1.5,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "success.main",
                        }}
                      />
                      Seçili Etiketler
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                      {form.tags.map((tag, index) => (
                        <Chip
                          key={tag._id || index}
                          label={`#${tag.name}`}
                          onDelete={() => {
                            const newTags = form.tags.filter(
                              (_, i) => i !== index
                            );
                            setForm({ ...form, tags: newTags });
                          }}
                          deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            borderRadius: 3,
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            height: 34,
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                            color: "primary.main",
                            border: (t) =>
                              `1px solid ${alpha(
                                t.palette.primary.main,
                                0.25
                              )}`,
                            "& .MuiChip-deleteIcon": {
                              color: "primary.main",
                              "&:hover": {
                                color: "error.main",
                                transform: "scale(1.15)",
                                bgcolor: (t) =>
                                  alpha(t.palette.error.main, 0.1),
                                borderRadius: "50%",
                              },
                              transition: "all 0.2s ease",
                            },
                            "&:hover": {
                              bgcolor: (t) =>
                                alpha(t.palette.primary.main, 0.18),
                              transform: "translateY(-1px)",
                              boxShadow: (t) =>
                                `0 4px 12px ${alpha(
                                  t.palette.primary.main,
                                  0.2
                                )}`,
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Autocomplete Input */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "info.main",
                      }}
                    />
                    Yeni Etiket Ekle
                  </Typography>

                  <Autocomplete
                    freeSolo
                    options={allTags}
                    value={null}
                    inputValue={tagInputValue}
                    onInputChange={(e, newInput) => setTagInputValue(newInput)}
                    getOptionLabel={(option) => option.name || ""}
                    filterSelectedOptions={false}
                    onChange={(e, newValue) => {
                      if (
                        newValue &&
                        !form.tags.some((t) => t._id === newValue._id)
                      ) {
                        setForm({ ...form, tags: [...form.tags, newValue] });
                        setTagInputValue("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInputValue.trim()) {
                        e.preventDefault();
                        handleAddTag(tagInputValue);
                      }
                    }}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                            transform: "translateX(2px)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: (t) =>
                                alpha(t.palette.primary.main, 0.1),
                              color: "primary.main",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                            }}
                          >
                            #
                          </Box>
                          <Typography variant="body2" fontWeight={500}>
                            {option.name}
                          </Typography>
                          {form.tags.some((t) => t._id === option._id) && (
                            <CheckCircleIcon
                              sx={{
                                fontSize: 16,
                                color: "success.main",
                                ml: "auto",
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Etiket ara veya yeni oluştur..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              {params.InputProps.endAdornment}
                              {tagInputValue.trim() && (
                                <Tooltip
                                  title={
                                    allTags.some(
                                      (t) =>
                                        t.name.toLowerCase() ===
                                        tagInputValue.trim().toLowerCase()
                                    )
                                      ? "Mevcut etiketi seç"
                                      : "Yeni etiket oluştur"
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <Chip
                                    label={
                                      allTags.some(
                                        (t) =>
                                          t.name.toLowerCase() ===
                                          tagInputValue.trim().toLowerCase()
                                      )
                                        ? "Seç"
                                        : "Yeni"
                                    }
                                    size="small"
                                    sx={{
                                      height: 22,
                                      fontSize: "0.65rem",
                                      fontWeight: 700,
                                      bgcolor: allTags.some(
                                        (t) =>
                                          t.name.toLowerCase() ===
                                          tagInputValue.trim().toLowerCase()
                                      )
                                        ? (t) =>
                                            alpha(t.palette.info.main, 0.12)
                                        : (t) =>
                                            alpha(t.palette.success.main, 0.12),
                                      color: allTags.some(
                                        (t) =>
                                          t.name.toLowerCase() ===
                                          tagInputValue.trim().toLowerCase()
                                      )
                                        ? "info.main"
                                        : "success.main",
                                      border: (t) =>
                                        `1px solid ${alpha(
                                          allTags.some(
                                            (t) =>
                                              t.name.toLowerCase() ===
                                              tagInputValue.trim().toLowerCase()
                                          )
                                            ? t.palette.info.main
                                            : t.palette.success.main,
                                          0.3
                                        )}`,
                                      animation: "pulse 1.5s infinite",
                                      "@keyframes pulse": {
                                        "0%, 100%": { opacity: 1 },
                                        "50%": { opacity: 0.8 },
                                      },
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: (t) =>
                              alpha(t.palette.background.paper, 0.9),
                            height: 48,
                            backdropFilter: "blur(8px)",
                            border: (t) =>
                              `1px solid ${alpha(t.palette.divider, 0.2)}`,
                            "&:hover": {
                              bgcolor: (t) =>
                                alpha(t.palette.background.paper, 1),
                              borderColor: (t) =>
                                alpha(t.palette.primary.main, 0.3),
                            },
                            "&.Mui-focused": {
                              bgcolor: (t) =>
                                alpha(t.palette.background.paper, 1),
                              borderColor: "primary.main",
                              boxShadow: (t) =>
                                `0 0 0 2px ${alpha(
                                  t.palette.primary.main,
                                  0.1
                                )}`,
                            },
                            transition: "all 0.2s ease",
                          },
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                        }}
                      />
                    )}
                    filterOptions={(options, state) => {
                      const input = state.inputValue.toLowerCase();
                      const filtered = options.filter(
                        (o) =>
                          o.name.toLowerCase().includes(input) &&
                          !form.tags.some((t) => t._id === o._id)
                      );
                      return filtered;
                    }}
                    ListboxProps={{
                      sx: {
                        borderRadius: 2,
                        mt: 0.5,
                        maxHeight: 200,
                        border: (t) =>
                          `1px solid ${alpha(t.palette.divider, 0.1)}`,
                        bgcolor: (t) => alpha(t.palette.background.paper, 0.98),
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        "& .MuiAutocomplete-option": {
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                        },
                        // Theme.js'deki scroll stilini kullan
                        scrollbarWidth: "thin",
                        scrollbarColor: (t) =>
                          t.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1) transparent"
                            : "rgba(0,0,0,0.1) transparent",
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.15)"
                              : "rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          backdropFilter: "blur(6px)",
                          transition: "all 0.3s ease",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundImage: (t) =>
                            t.palette.mode === "dark"
                              ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
                              : "linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))",
                        },
                      },
                    }}
                    PaperComponent={({ children, ...props }) => (
                      <Paper
                        {...props}
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          border: (t) =>
                            `1px solid ${alpha(t.palette.divider, 0.1)}`,
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          bgcolor: (t) =>
                            alpha(t.palette.background.paper, 0.98),
                          backdropFilter: "blur(12px)",
                          mt: 0.5,
                          overflow: "hidden",
                        }}
                      >
                        {children}
                      </Paper>
                    )}
                  />
                </Box>

                {/* Help Text */}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: (t) =>
                      `1px solid ${alpha(t.palette.divider, 0.1)}`,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={3}
                    flexWrap="wrap"
                    alignItems="center"
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "success.main",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        <strong>Enter:</strong> Yeni etiket oluştur
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "info.main",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        <strong>Tıkla:</strong> Mevcut etiketi seç
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        SEO için <strong>3-5 etiket</strong> önerilir
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Card
              sx={{
                p: 4,
                bgcolor: (t) =>
                  isFormValid
                    ? alpha(t.palette.success.main, 0.02)
                    : alpha(t.palette.warning.main, 0.02),
                borderRadius: 4,
                border: (t) =>
                  `2px solid ${
                    isFormValid
                      ? alpha(t.palette.success.main, 0.2)
                      : alpha(t.palette.warning.main, 0.2)
                  }`,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {isFormValid ? (
                      <>
                        <CheckCircleIcon sx={{ color: "success.main" }} />
                        Form tamamlandı!
                      </>
                    ) : (
                      <>
                        <WarningIcon sx={{ color: "warning.main" }} />
                        Eksik bilgiler var
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isFormValid
                      ? "Yazınız yayınlamaya hazır. Önizlemeyi unutmayın!"
                      : "Lütfen tüm zorunlu alanları doğru şekilde doldurun"}
                  </Typography>

                  {!isFormValid && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="warning.main"
                        sx={{ mb: 1 }}
                      >
                        Eksik alanlar:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {!titleValidation.isValid && (
                          <Chip
                            label="Başlık"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        {!categoryValidation.isValid && (
                          <Chip
                            label="Kategori"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        {!summaryValidation.isValid && (
                          <Chip
                            label="Özet"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        {!contentValidation.isValid && (
                          <Chip
                            label="İçerik"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/admin/posts")}
                    sx={{
                      height: CONTROL_H,
                      borderRadius: 4,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      px: 3,
                      borderColor: (t) => alpha(t.palette.text.primary, 0.2),
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    İptal
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : id ? (
                        <SaveIcon />
                      ) : (
                        <PublishIcon />
                      )
                    }
                    sx={(t) => ({
                      height: CONTROL_H,
                      borderRadius: 4,
                      textTransform: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      px: 4,
                      background: `linear-gradient(135deg, ${
                        t.palette.primary.main
                      }, ${darken(t.palette.primary.main, 0.2)})`,
                      boxShadow: `0 4px 16px ${alpha(
                        t.palette.primary.main,
                        0.3
                      )}`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 24px ${alpha(
                          t.palette.primary.main,
                          0.4
                        )}`,
                      },
                      "&:disabled": {
                        background: (t) => alpha(t.palette.text.secondary, 0.3),
                        color: (t) => alpha(t.palette.text.secondary, 0.5),
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                    })}
                  >
                    {isSubmitting
                      ? "İşleniyor..."
                      : id
                      ? "Güncelle"
                      : "Yayınla"}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={form}
        categories={categories}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: (t) =>
              `0 8px 32px ${alpha(t.palette[snackbar.severity].main, 0.3)}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostEditorPage;
