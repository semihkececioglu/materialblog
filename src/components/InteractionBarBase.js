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

  const postId = window.location.pathname;
  const globalLikeKey = `likeCount_${postId}`;

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem(globalLikeKey)) || 0;
    setLikeCount(storedCount);

    if (!user) {
      setLiked(false);
      return;
    }

    const storageKey = `likedPosts_${user.username || user.name}`;
    const likedList = JSON.parse(localStorage.getItem(storageKey)) || [];
    setLiked(likedList.includes(postId));
  }, [user, postId]);

  const handleLike = () => {
    if (!user) {
      setSnackbar({ open: true, message: "Beğenmek için giriş yapmalısınız." });
      return;
    }

    const storageKey = `likedPosts_${user.username || user.name}`;
    let likedList = JSON.parse(localStorage.getItem(storageKey)) || [];
    let updatedCount = likeCount;

    if (likedList.includes(postId)) {
      likedList = likedList.filter((id) => id !== postId);
      updatedCount--;
      setLiked(false);
    } else {
      likedList.push(postId);
      updatedCount++;
      setLiked(true);
    }

    localStorage.setItem(storageKey, JSON.stringify(likedList));
    localStorage.setItem(globalLikeKey, updatedCount);
    setLikeCount(updatedCount);
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
  };

  return (
    <>
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

          <Tooltip title="Kaydet">
            <IconButton
              onClick={() => {
                if (!user) {
                  setSnackbar({
                    open: true,
                    message: "Kaydetmek için giriş yapmalısınız.",
                  });
                }
              }}
              size="small"
            >
              <BookmarkBorder fontSize="small" />
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
              <ListItem
                button
                onClick={handleCopyLink}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: "#555",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#6e6e6e",
                    color: "#fff",
                  },
                }}
              >
                <ContentCopy fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary="Bağlantıyı Kopyala" />
              </ListItem>

              <ListItem
                button
                component="a"
                href={`https://x.com/share?url=${window.location.href}`}
                target="_blank"
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: "#000",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#000",
                    color: "#fff",
                  },
                }}
              >
                <XIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary="X (Twitter) ile Paylaş" />
              </ListItem>

              <ListItem
                button
                component="a"
                href={`https://wa.me/?text=${window.location.href}`}
                target="_blank"
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: "#25D366",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#25D366",
                    color: "#fff",
                  },
                }}
              >
                <WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary="WhatsApp ile Paylaş" />
              </ListItem>

              <ListItem
                button
                component="a"
                href={`https://t.me/share/url?url=${window.location.href}`}
                target="_blank"
                sx={{
                  borderRadius: 1,
                  color: "#0088cc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#0088cc",
                    color: "#fff",
                  },
                }}
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
    </>
  );
};

export default InteractionBarBase;
