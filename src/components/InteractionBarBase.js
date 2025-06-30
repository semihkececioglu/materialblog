import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  ChatBubbleOutline,
  Share,
  KeyboardArrowUp,
  ContentCopy,
} from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";

import { useSelector, useDispatch } from "react-redux";
import {
  setLiked,
  setSaved,
  setLikeCount,
  fetchInteractionData,
} from "../redux/interactionSlice";

import axios from "axios";

const InteractionBarBase = ({ position = "fixed", visible = true, postId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const liked = useSelector((state) => state.interaction.liked);
  const saved = useSelector((state) => state.interaction.saved);
  const likeCount = useSelector((state) => state.interaction.likeCount);
  const commentCount = useSelector((state) => state.interaction.commentCount);

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [anchorEl, setAnchorEl] = useState(null);
  const prevUserIdRef = useRef(null);

  // İlk yüklemede tüm interaction verilerini getir
  useEffect(() => {
    if (postId && user?._id) {
      dispatch(fetchInteractionData({ postId, userId: user._id }));
      prevUserIdRef.current = user._id;
    }
  }, [postId]);

  // Kullanıcı değiştiğinde sadece durum güncelle (sayılar sabit)
  useEffect(() => {
    const currentUserId = user?._id;
    const prevUserId = prevUserIdRef.current;

    if (postId && currentUserId && currentUserId !== prevUserId) {
      axios
        .get(
          `https://materialblog-server-production.up.railway.app/api/posts/${postId}/like-status`,
          { params: { userId: currentUserId } }
        )
        .then((res) => {
          dispatch(setLiked(res.data.liked));
          dispatch(setLikeCount(res.data.likeCount));
        });

      axios
        .get(
          `https://materialblog-server-production.up.railway.app/api/users/id/${currentUserId}`
        )
        .then((res) => {
          const isSaved = res.data.savedPosts?.includes(postId);
          dispatch(setSaved(isSaved));
        });

      prevUserIdRef.current = currentUserId;
    }
  }, [user?._id, postId, dispatch]);

  const handleLike = async () => {
    if (!user?._id) {
      return setSnackbar({ open: true, message: "Beğenmek için giriş yapın." });
    }

    try {
      const res = await axios.post(
        `https://materialblog-server-production.up.railway.app/api/posts/${postId}/like`,
        { userId: user._id }
      );
      dispatch(setLiked(res.data.liked));
      dispatch(setLikeCount(res.data.likeCount));
    } catch {
      setSnackbar({ open: true, message: "Beğeni hatası" });
    }
  };

  const handleSave = async () => {
    if (!user?._id) {
      return setSnackbar({
        open: true,
        message: "Kaydetmek için giriş yapın.",
      });
    }

    try {
      const res = await axios.post(
        `https://materialblog-server-production.up.railway.app/api/posts/${postId}/save`,
        { userId: user._id }
      );
      dispatch(setSaved(res.data.saved));
    } catch {
      setSnackbar({ open: true, message: "Kaydetme hatası" });
    }
  };

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleScrollToComments = () => {
    const form = document.getElementById("comment-form");
    if (form) form.scrollIntoView({ behavior: "smooth" });
  };

  const handleShareClick = (e) => setAnchorEl(e.currentTarget);
  const handleShareClose = () => setAnchorEl(null);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({ open: true, message: "Bağlantı kopyalandı" });
    handleShareClose();
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
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
        zIndex: 1300,
        mt: position === "static" ? 4 : 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 999,
          px: 2,
          py: 1,
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
              rel="noopener noreferrer"
            >
              <XIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="X ile Paylaş" />
            </ListItem>
            <ListItem
              button
              component="a"
              href={`https://wa.me/?text=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="WhatsApp ile Paylaş" />
            </ListItem>
            <ListItem
              button
              component="a"
              href={`https://t.me/share/url?url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
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
