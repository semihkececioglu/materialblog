import React, { useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Fade,
  Grow,
  useTheme,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Share as ShareIcon,
  Link as LinkIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

const ShareDialog = ({ open, onClose, post }) => {
  const theme = useTheme();
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const currentUrl = window.location.href;
  const shareText = `${post.title}`;

  const shareOptions = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      color: "#1877f2",
      bgColor: "#e7f3ff",
      darkBgColor: "#1a365d",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      color: "#25d366",
      bgColor: "#dcfce7",
      darkBgColor: "#14532d",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            shareText + " " + currentUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      color: "#1d9bf0",
      bgColor: "#dbeafe",
      darkBgColor: "#1e3a8a",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(currentUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      color: "#229ed9",
      bgColor: "#dbeafe",
      darkBgColor: "#1e40af",
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            currentUrl
          )}&text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      color: "#0a66c2",
      bgColor: "#dbeafe",
      darkBgColor: "#1e40af",
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "E-posta",
      icon: EmailIcon,
      color: "#6b7280",
      bgColor: "#f3f4f6",
      darkBgColor: "#374151",
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(
            post.title
          )}&body=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`,
          "_self"
        );
      },
    },
  ];

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        disableScrollLock={true}
        PaperProps={{
          sx: {
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          onClick: onClose,
        }}
      >
        <Fade in={open} timeout={300}>
          <Paper
            onClick={(e) => e.stopPropagation()}
            elevation={0}
            sx={{
              width: "90%",
              maxWidth: { xs: 380, sm: 450, md: 500 },
              background: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 25px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
            }}
          >
            {/* Responsive Header */}
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                pb: { xs: 1.5, sm: 2 },
                borderBottom: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(145deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))"
                    : "linear-gradient(145deg, rgba(0,0,0,0.01), rgba(0,0,0,0.005))",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShareIcon
                      sx={{ color: "white", fontSize: { xs: 18, sm: 20 } }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                    >
                      Paylaş
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.2,
                        maxWidth: { xs: 200, sm: 300 },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    color: "text.secondary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.error.main + "15",
                      color: theme.palette.error.main,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                </IconButton>
              </Box>
            </Box>

            {/* 2x3 Grid Share Options */}
            <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(2, 1fr)",
                  gap: { xs: 2, sm: 2.5 },
                }}
              >
                {shareOptions.map((option, index) => {
                  const IconComponent = option.icon;

                  return (
                    <Grow key={option.name} in timeout={200 + index * 50}>
                      <Box
                        onClick={option.action}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: { xs: 0.8, sm: 1 },
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-3px) scale(1.02)",
                            "& .icon-container": {
                              backgroundColor: option.color,
                              boxShadow: `0 6px 24px -4px ${option.color}40`,
                              "& .share-icon": {
                                color: "white",
                                transform: "scale(1.1)",
                              },
                            },
                          },
                        }}
                      >
                        <Box
                          className="icon-container"
                          sx={{
                            width: { xs: 50, sm: 56, md: 60 },
                            height: { xs: 50, sm: 56, md: 60 },
                            borderRadius: "50%",
                            background:
                              theme.palette.mode === "dark"
                                ? option.darkBgColor
                                : option.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: "2px solid",
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.06)"
                                : "rgba(0,0,0,0.04)",
                          }}
                        >
                          <IconComponent
                            className="share-icon"
                            sx={{
                              fontSize: { xs: 20, sm: 22, md: 24 },
                              color: option.color,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            textAlign: "center",
                            color: "text.secondary",
                            lineHeight: 1.2,
                          }}
                        >
                          {option.name}
                        </Typography>
                      </Box>
                    </Grow>
                  );
                })}
              </Box>
            </Box>

            {/* Responsive Copy Link Section */}
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                pt: { xs: 1, sm: 1 },
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.015)",
                borderTop: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  letterSpacing: 0.5,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                veya Linki Kopyala
              </Typography>
              <Box
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  setShowCopySuccess(true);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.02)",
                  border: "2px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main + "08",
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 20px -4px ${theme.palette.primary.main}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LinkIcon
                    sx={{
                      fontSize: { xs: 16, sm: 18 },
                      color: "text.secondary",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    color: "text.secondary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                >
                  {currentUrl}
                </Typography>
                <Box
                  sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.4, sm: 0.5 },
                    borderRadius: 2,
                    background: theme.palette.primary.main + "20",
                    color: theme.palette.primary.main,
                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  KOPYALA
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2500}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowCopySuccess(false)}
          severity="success"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.2)",
            "& .MuiAlert-icon": {
              fontSize: "1.25rem",
            },
          }}
        >
          Link kopyalandı!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialog;
