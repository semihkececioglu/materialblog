import React, { useState, useEffect, useMemo } from "react";
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
  Avatar,
  Chip,
  Skeleton,
  Fade,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "../../redux/commentSlice";
import CommentItem from "./CommentItem";
import { alpha } from "@mui/material/styles";
import {
  Comment as CommentIcon,
  Sort as SortIcon,
  Send as SendIcon,
  Login as LoginIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Favorite as FavoriteIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.user.currentUser);
  const { items: flatComments, loading } = useSelector(
    (state) => state.comments
  );

  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  // Snackbar'ı kapatma fonksiyonu
  // (Duplicate removed)

  useEffect(() => {
    if (postId) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment = {
      user: user.id,
      postId,
      text,
    };

    try {
      await dispatch(addComment(newComment));
      setText("");
      setIsFormExpanded(false);
      showSnackbar("Yorum başarıyla eklendi", "add");
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
      showSnackbar("Yorum eklenirken hata oluştu", "error");
    }
  };

  const handleReplySubmit = async (parentId, replyObj) => {
    const newReply = {
      user: replyObj.user,
      postId,
      parentId,
      text: replyObj.text,
    };

    try {
      await dispatch(addComment(newReply));
      showSnackbar("Yanıt başarıyla eklendi", "add");
    } catch (err) {
      console.error("Yanıt eklenemedi:", err);
      showSnackbar("Yanıt eklenirken hata oluştu", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteComment(id));
      showSnackbar("Yorum başarıyla silindi", "delete");
    } catch (err) {
      console.error("Silme başarısız:", err);
      showSnackbar("Silme işlemi başarısız", "error");
    }
  };

  // showSnackbar fonksiyonunu sadeleştir
  const showSnackbar = (message, type = "info") => {
    setSnackbar({ open: true, message, type });
  };

  // handleCloseSnackbar fonksiyonu
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", type: "" });
  };

  const getSnackbarIcon = (type) => {
    switch (type) {
      case "add":
        return <AddIcon sx={{ fontSize: 20 }} />;
      case "delete":
        return <DeleteIcon sx={{ fontSize: 20 }} />;
      case "error":
        return <ErrorIcon sx={{ fontSize: 20 }} />;
      case "success":
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case "warning":
        return <WarningIcon sx={{ fontSize: 20 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getSnackbarStyles = (type) => {
    const baseStyle = {
      borderRadius: 3,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      fontWeight: 500,
      fontSize: "0.85rem",
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      minHeight: "52px",
      color: "white",
      position: "relative",
      overflow: "hidden",
    };

    switch (type) {
      case "add":
        return {
          ...baseStyle,
          background:
            "linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.95))",
          borderColor: "rgba(76, 175, 80, 0.6)",
          boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)",
        };
      case "delete":
        return {
          ...baseStyle,
          background:
            "linear-gradient(135deg, rgba(244, 67, 54, 0.9), rgba(211, 47, 47, 0.95))",
          borderColor: "rgba(244, 67, 54, 0.6)",
          boxShadow: "0 8px 32px rgba(244, 67, 54, 0.4)",
        };
      case "error":
        return {
          ...baseStyle,
          background:
            "linear-gradient(135deg, rgba(244, 67, 54, 0.9), rgba(211, 47, 47, 0.95))",
          borderColor: "rgba(244, 67, 54, 0.6)",
          boxShadow: "0 8px 32px rgba(244, 67, 54, 0.4)",
        };
      case "success":
        return {
          ...baseStyle,
          background:
            "linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.95))",
          borderColor: "rgba(76, 175, 80, 0.6)",
          boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)",
        };
      case "warning":
        return {
          ...baseStyle,
          background:
            "linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(245, 124, 0, 0.95))",
          borderColor: "rgba(255, 152, 0, 0.6)",
          boxShadow: "0 8px 32px rgba(255, 152, 0, 0.4)",
        };
      default:
        return {
          ...baseStyle,
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(25, 118, 210, 0.95))",
          borderColor: "rgba(33, 150, 243, 0.6)",
          boxShadow: "0 8px 32px rgba(33, 150, 243, 0.4)",
        };
    }
  };

  const buildNestedComments = (comments) => {
    const map = {};
    comments.forEach((c) => (map[c._id] = { ...c, replies: [] }));
    const nested = [];
    comments.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        nested.push(map[c._id]);
      }
    });
    return nested;
  };

  const sortedComments = useMemo(() => {
    const nested = buildNestedComments(flatComments);
    return nested.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortOrder === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortOrder === "mostLiked") {
        const aLikes = a.likes?.length || 0;
        const bLikes = b.likes?.length || 0;
        return bLikes - aLikes;
      }
      return 0;
    });
  }, [flatComments, sortOrder]);

  const getSortIcon = (value) => {
    switch (value) {
      case "newest":
        return <ScheduleIcon sx={{ fontSize: 16 }} />;
      case "oldest":
        return <TrendingUpIcon sx={{ fontSize: 16 }} />;
      case "mostLiked":
        return <FavoriteIcon sx={{ fontSize: 16 }} />;
      default:
        return <SortIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <motion.div
      id="comment-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box sx={{ mt: 6 }}>
        {/* Modern Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              mb: 4,
              borderRadius: 4,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
              backdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Enhanced Header with Icon */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Box
                  sx={{
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 24px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  }}
                >
                  <ChatIcon
                    sx={{
                      fontSize: { xs: 24, md: 28 },
                      color: "white",
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1.2,
                    }}
                  >
                    Yorumlar
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      size="small"
                      label={`${flatComments.length} yorum`}
                      sx={{
                        height: 24,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        border: "none",
                      }}
                    />
                    {loading && (
                      <Chip
                        size="small"
                        label="Yükleniyor..."
                        sx={{
                          height: 24,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: "warning.main",
                          border: "none",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Enhanced Sort Dropdown - Layout Shift Düzeltildi */}
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                size="small"
                // Layout shift düzeltmesi
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      mt: 1,
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      backdropFilter: "blur(20px)",
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 30, 30, 0.95)"
                          : "rgba(255, 255, 255, 0.95)",
                    },
                  },
                }}
                sx={{
                  minWidth: { xs: "100%", md: 200 },
                  height: 44,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(10px)",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  "& .MuiSelect-select": {
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    // Transform kaldırıldı - layout shift önleme
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  },
                  transition: "all 0.2s ease",
                }}
                renderValue={(value) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getSortIcon(value)}
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      {value === "newest" && "En Yeni"}
                      {value === "oldest" && "En Eski"}
                      {value === "mostLiked" && "En Beğenilen"}
                    </Typography>
                  </Box>
                )}
              >
                <MenuItem
                  value="newest"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <ScheduleIcon sx={{ fontSize: 18 }} />
                    En Yeni
                  </Box>
                </MenuItem>
                <MenuItem
                  value="oldest"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 18 }} />
                    En Eski
                  </Box>
                </MenuItem>
                <MenuItem
                  value="mostLiked"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <FavoriteIcon sx={{ fontSize: 18 }} />
                    En Beğenilen
                  </Box>
                </MenuItem>
              </Select>
            </Box>
          </Paper>
        </motion.div>

        {/* Enhanced Comments List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ py: 2 }}>
                {[...Array(3)].map((_, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Skeleton
                      variant="rectangular"
                      height={120}
                      sx={{ borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <List sx={{ py: 0 }}>
                {sortedComments.map((comment, index) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CommentItem
                      comment={comment}
                      onReplySubmit={handleReplySubmit}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      onDelete={handleDelete}
                      onNotify={showSnackbar}
                      showSnackbar={showSnackbar}
                    />
                  </motion.div>
                ))}
              </List>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Comment Form or Login Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {!user ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mt: 4,
                textAlign: "center",
                borderRadius: 4,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
                    : "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
                backdropFilter: "blur(20px)",
                border: "2px dashed",
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <LoginIcon sx={{ fontSize: 32, color: "primary.main" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Sohbete Katılın!
              </Typography>
              <Typography
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                Düşüncelerinizi paylaşmak ve diğer okuyucularla etkileşime
                geçmek için giriş yapın.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 20px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Giriş Yap
              </Button>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mt: 4,
                borderRadius: 4,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
                    : "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                backdropFilter: "blur(20px)",
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(0,0,0,0.3)"
                    : "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Avatar
                  src={
                    user?.profilePicture || user?.profileImage || user?.avatar
                  }
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.main",
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "2px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {!user?.profilePicture && !user?.profileImage && !user?.avatar
                    ? user?.username?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"
                    : null}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {user?.username ||
                      user?.displayName ||
                      user?.email?.split("@")[0]}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Yorum yazıyor...
                  </Typography>
                </Box>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  multiline
                  rows={isFormExpanded ? 4 : 3}
                  fullWidth
                  placeholder="Düşüncelerinizi paylaşın..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setIsFormExpanded(true)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: "blur(10px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      "&.Mui-focused": {
                        borderColor: "primary.main",
                        boxShadow: `0 0 0 2px ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    },
                  }}
                />
                <Fade in={isFormExpanded || text.length > 0}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {text.length}/1000 karakter
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {isFormExpanded && (
                        <Button
                          onClick={() => {
                            setIsFormExpanded(false);
                            setText("");
                          }}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            px: 3,
                            color: "text.secondary",
                          }}
                        >
                          İptal
                        </Button>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!text.trim()}
                        endIcon={<SendIcon />}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          px: 4,
                          py: 1.2,
                          fontWeight: 600,
                          boxShadow: `0 4px 12px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 6px 16px ${alpha(
                              theme.palette.primary.main,
                              0.4
                            )}`,
                          },
                          "&:disabled": {
                            transform: "none",
                            boxShadow: "none",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Gönder
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </form>
            </Paper>
          )}
        </motion.div>

        {/* Snackbar - sadece bir tane */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Fade}
        >
          <Box sx={getSnackbarStyles(snackbar.type)}>
            {getSnackbarIcon(snackbar.type)}
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
              {snackbar.message}
            </Typography>
          </Box>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default CommentSection;
