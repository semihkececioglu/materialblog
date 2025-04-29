import React, { useState, useEffect } from "react";
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

const InteractionBarBase = ({ visible = true, position = "fixed" }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const { liked, setLiked, likeCount, setLikeCount, commentCount } =
    useInteractionBar();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    let total = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("likedPosts_")) {
        const likedList = JSON.parse(localStorage.getItem(key)) || [];
        const matched = likedList.some((item) =>
          typeof item === "string"
            ? item === currentPath
            : item?.path === currentPath
        );
        if (matched) total++;
      }
    });
    setLikeCount(total);

    if (!user) {
      setLiked(false);
      setSaved(false);
      return;
    }

    const postPath = currentPath;
    const storageKeyLiked = `likedPosts_${user.username || user.name}`;
    const storageKeySaved = `savedPosts_${user.username || user.name}`;

    const likedStored = JSON.parse(localStorage.getItem(storageKeyLiked)) || [];
    const savedStored = JSON.parse(localStorage.getItem(storageKeySaved)) || [];

    const alreadyLiked = likedStored.find(
      (item) => item.path === postPath || item === postPath
    );
    const alreadySaved = savedStored.find(
      (item) => item.path === postPath || item === postPath
    );

    setLiked(!!alreadyLiked);
    setSaved(!!alreadySaved);
  }, [user]);

  const handleLike = () => {
    if (!user) {
      setSnackbar({ open: true, message: "Beğenmek için giriş yapmalısınız." });
      return;
    }

    const postPath = window.location.pathname;
    const postTitle = document.title;
    const storageKey = `likedPosts_${user.username || user.name}`;
    const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    const alreadyLiked = stored.find(
      (item) => item.path === postPath || item === postPath
    );

    let updated;
    let globalCount = likeCount;

    if (alreadyLiked) {
      updated = stored.filter((item) =>
        typeof item === "string" ? item !== postPath : item.path !== postPath
      );
      setLiked(false);
      globalCount = Math.max(globalCount - 1, 0);
    } else {
      updated = [...stored, { path: postPath, title: postTitle }];
      setLiked(true);
      globalCount += 1;
    }

    localStorage.setItem(storageKey, JSON.stringify(updated));
    setLikeCount(globalCount);
  };

  const handleSave = () => {
    if (!user) {
      setSnackbar({ open: true, message: "Kaydetmek için giriş yapın." });
      return;
    }

    const postPath = window.location.pathname;
    const postTitle = document.title;
    const storageKey = `savedPosts_${user.username || user.name}`;
    const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    const alreadySaved = stored.find(
      (item) => item.path === postPath || item === postPath
    );

    let updated;
    if (alreadySaved) {
      updated = stored.filter((item) =>
        typeof item === "string" ? item !== postPath : item.path !== postPath
      );
      setSaved(false);
    } else {
      updated = [...stored, { path: postPath, title: postTitle }];
      setSaved(true);
    }

    localStorage.setItem(storageKey, JSON.stringify(updated));
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
