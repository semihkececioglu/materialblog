import React, { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  useTheme,
  Popover,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Bookmark,
  BookmarkBorder,
  Share,
  KeyboardArrowUp,
  ContentCopy,
} from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useInteractionBar } from "../contexts/InteractionBarContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const InteractionBarBase = ({ visible = true, position = "fixed" }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const {
    liked,
    setLiked,
    likeCount,
    setLikeCount,
    commentCount,
    saved,
    setSaved,
  } = useInteractionBar();

  const { user } = useAuth();
  const slug = window.location.pathname.split("/").pop();

  const handleLike = async () => {
    if (!user) {
      setSnackbar({ open: true, message: "Beğenmek için giriş yapmalısınız." });
      return;
    }

    console.log("➡️ [handleLike] Başladı");
    console.log("Slug:", slug);
    console.log("User ID:", user._id);

    try {
      const res = await axios.post(
        `https://materialblog-server-production.up.railway.app/api/posts/slug/${slug}/like`,
        { userId: user._id }
      );

      console.log("✅ [handleLike] Yanıt:", res.data);

      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (error) {
      console.error(
        "❌ [handleLike] Hata:",
        error?.response?.data || error.message
      );
      setSnackbar({ open: true, message: "Beğeni işlemi başarısız oldu." });
    }
  };

  const handleSave = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Kaydetmek için giriş yapmalısınız.",
      });
      return;
    }

    console.log("➡️ [handleSave] Başladı");
    console.log("Slug:", slug);
    console.log("User ID:", user._id);

    try {
      const res = await axios.post(
        `https://materialblog-server-production.up.railway.app/api/posts/slug/${slug}/save`,
        { userId: user._id }
      );

      console.log("✅ [handleSave] Yanıt:", res.data);

      setSaved(res.data.saved);
    } catch (error) {
      console.error(
        "❌ [handleSave] Hata:",
        error?.response?.data || error.message
      );
      setSnackbar({ open: true, message: "Kaydetme işlemi başarısız oldu." });
    }
  };

  const handleScrollToComments = () => {
    const form = document.getElementById("comment-form");
    if (form) form.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleShareClick = (event) => setAnchorEl(event.currentTarget);
  const handleShareClose = () => setAnchorEl(null);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    handleShareClose();
    setSnackbar({ open: true, message: "Bağlantı kopyalandı" });
  };

  return (
    <Box
      sx={{
        position: position === "fixed" ? "fixed" : "static",
        bottom: position === "fixed" ? 16 : undefined,
        left: position === "fixed" ? "50%" : undefined,
        transform: position === "fixed" ? "translateX(-50%)" : undefined,
        display: "flex",
        justifyContent: position === "static" ? "center" : undefined,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        zIndex: 1300,
        pointerEvents: visible ? "auto" : "none",
        mt: position === "static" ? 4 : 0,
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: "999px",
          boxShadow: 3,
          px: 1.5,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Tooltip title="Beğen">
          <IconButton onClick={handleLike} size="small">
            {liked ? (
              <Favorite fontSize="small" color="error" />
            ) : (
              <FavoriteBorder fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Typography fontSize="0.75rem">{likeCount}</Typography>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Yorumlara Git">
          <IconButton onClick={handleScrollToComments} size="small">
            <ChatBubbleOutline fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography fontSize="0.75rem">{commentCount}</Typography>

        <Divider orientation="vertical" flexItem />

        <Tooltip title={saved ? "Kaydedildi" : "Kaydet"}>
          <IconButton onClick={handleSave} size="small">
            {saved ? (
              <Bookmark fontSize="small" color="primary" />
            ) : (
              <BookmarkBorder fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Paylaş">
          <IconButton onClick={handleShareClick} size="small">
            <Share fontSize="small" />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleShareClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1,
              boxShadow: 5,
              bgcolor: theme.palette.background.paper,
              minWidth: 250,
            },
          }}
        >
          <List dense disablePadding>
            <ListItem button onClick={handleCopyLink}>
              <ContentCopy fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="Bağlantıyı Kopyala" />
            </ListItem>
            <ListItem
              button
              component="a"
              href={`https://x.com/share?url=${window.location.href}`}
              target="_blank"
            >
              <XIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="X (Twitter) ile Paylaş" />
            </ListItem>
            <ListItem
              button
              component="a"
              href={`https://wa.me/?text=${window.location.href}`}
              target="_blank"
            >
              <WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="WhatsApp ile Paylaş" />
            </ListItem>
            <ListItem
              button
              component="a"
              href={`https://t.me/share/url?url=${window.location.href}`}
              target="_blank"
            >
              <TelegramIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="Telegram ile Paylaş" />
            </ListItem>
          </List>
        </Popover>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Yukarı Çık">
          <IconButton onClick={handleScrollTop} size="small">
            <KeyboardArrowUp fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InteractionBarBase;
