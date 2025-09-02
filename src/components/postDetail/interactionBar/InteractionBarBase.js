import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Snackbar,
  Alert,
  Badge,
  useTheme,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  ChatBubbleOutline,
  Share,
  KeyboardArrowUp,
} from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import {
  setLiked,
  setSaved,
  setLikeCount,
  fetchInteractionData,
} from "../../../redux/interactionSlice";

import ShareDialog from "../../ShareDialog";
import axios from "axios";

const InteractionBarBase = ({ position = "fixed", visible = true, postId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.user.currentUser);
  const post = useSelector((state) => state.posts.selectedPost); // Post verisini al
  const liked = useSelector((state) => state.interaction.liked);
  const saved = useSelector((state) => state.interaction.saved);
  const likeCount = useSelector((state) => state.interaction.likeCount);
  const commentCount = useSelector((state) => state.interaction.commentCount);

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const prevUserIdRef = useRef(null);

  // Post bilgisini ShareDialog için hazırla - Redux store'dan gerçek veriyi al
  const currentPost = {
    _id: postId,
    title:
      post?.title || document.title.replace(" - MUI Blog", "") || "Blog Yazısı",
    image: post?.image || null,
    category: post?.category || null,
    tags: post?.tags || [],
    content: post?.content || "",
    user: post?.user || null,
  };

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

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          position: position === "fixed" ? "fixed" : "static",
          bottom: position === "fixed" ? 20 : undefined,
          left: position === "fixed" ? "50%" : undefined,
          transform: position === "fixed" ? "translateX(-50%)" : undefined,
          display: "flex",
          justifyContent: position === "static" ? "center" : undefined,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1300,
          mt: position === "static" ? 4 : 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // Glassmorphism Background
            background:
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)", // Safari support
            borderRadius: 999,
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.08)",
            // Enhanced shadows for depth
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                : "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            px: 2.5,
            py: 1.5,
            gap: 1,
            // Hover effect
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 12px 48px rgba(0, 0, 0, 0.5), 0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                  : "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          {/* Like Button with Badge */}
          <Tooltip title="Beğen" placement="top">
            <Badge
              badgeContent={likeCount > 0 ? likeCount : null}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.6rem",
                  height: 16,
                  minWidth: 16,
                  fontWeight: 600,
                },
              }}
            >
              <IconButton
                onClick={handleLike}
                size="small"
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.06)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {liked ? (
                  <Favorite fontSize="small" color="error" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
              </IconButton>
            </Badge>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              mx: 0.5,
            }}
          />

          {/* Comment Button with Badge */}
          <Tooltip title="Yorumlara Git" placement="top">
            <Badge
              badgeContent={commentCount > 0 ? commentCount : null}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.6rem",
                  height: 16,
                  minWidth: 16,
                  fontWeight: 600,
                },
              }}
            >
              <IconButton
                onClick={handleScrollToComments}
                size="small"
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.06)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ChatBubbleOutline fontSize="small" />
              </IconButton>
            </Badge>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              mx: 0.5,
            }}
          />

          {/* Save Button */}
          <Tooltip title={saved ? "Kaydedildi" : "Kaydet"} placement="top">
            <IconButton
              onClick={handleSave}
              size="small"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.06)",
                  transform: "scale(1.1)",
                },
              }}
            >
              {saved ? (
                <Bookmark fontSize="small" color="primary" />
              ) : (
                <BookmarkBorder fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              mx: 0.5,
            }}
          />

          {/* Share Button */}
          <Tooltip title="Paylaş" placement="top">
            <IconButton
              onClick={handleShareClick}
              size="small"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.06)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Share fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              mx: 0.5,
            }}
          />

          {/* Scroll Top Button */}
          <Tooltip title="Yukarı Çık" placement="top">
            <IconButton
              onClick={handleScrollTop}
              size="small"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.06)",
                  transform: "scale(1.1)",
                },
              }}
            >
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
          <Alert
            severity="info"
            variant="filled"
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        post={currentPost}
      />
    </>
  );
};

export default InteractionBarBase;
