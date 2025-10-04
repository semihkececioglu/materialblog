import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Tooltip,
  Paper,
  Skeleton,
  Badge,
} from "@mui/material";
import {
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Star as StarIcon,
} from "@mui/icons-material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { alpha } from "@mui/material/styles";
import XIcon from "@mui/icons-material/X";

const SocialMediaBox = React.memo(() => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false); // Sadece star loading için false başlat
  const [starCount, setStarCount] = useState(0);
  const [starLoading, setStarLoading] = useState(true); // Star için ayrı loading state

  // GitHub repository bilgileri
  const GITHUB_REPO = "semihkececioglu/materialblog";

  const socialLinks = [
    {
      name: "Twitter",
      icon: <XIcon />,
      color: "#1DA1F2",
      link: "https://twitter.com/",
      username: "@username",
      type: "external",
    },
    {
      name: "GitHub",
      icon: <GitHub />,
      color: "#24292e",
      link: "https://github.com/semihkececioglu",
      username: "semihkececioglu",
      type: "external",
    },
    {
      name: "Instagram",
      icon: <Instagram />,
      color: "#E1306C",
      link: "https://instagram.com/",
      username: "@username",
      type: "external",
    },
    {
      name: "Twitch",
      icon: <SportsEsportsIcon />,
      color: "#9146FF",
      link: "https://twitch.tv/",
      username: "username",
      type: "external",
    },
    {
      name: "Facebook",
      icon: <Facebook />,
      color: "#1877F2",
      link: "https://facebook.com/",
      username: "Page Name",
      type: "external",
    },
    {
      name: "Star Project",
      icon: <StarIcon />,
      color: "#FFD700",
      link: `https://github.com/${GITHUB_REPO}`,
      username: `Star this project`,
      type: "star",
    },
  ];

  // GitHub API'den star sayısını çek
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        setStarLoading(true);
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}`
        );
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count || 0);
        }
      } catch (error) {
        console.error("GitHub API error:", error);
        setStarCount(42); // Fallback star count
      } finally {
        setStarLoading(false);
      }
    };

    fetchStarCount();
  }, []);

  // Memoized styles with fixed height - minHeight'ı azalt
  const paperStyles = useMemo(
    () => ({
      p: 2,
      mt: 3,
      minHeight: 240, // 280'den 240'a düşürüldü - boşluğu azaltır
      borderRadius: 2,
      bgcolor: (theme) =>
        theme.palette.mode === "dark"
          ? alpha(theme.palette.background.paper, 0.4)
          : alpha(theme.palette.background.paper, 0.85),
      backdropFilter: "blur(12px)",
      border: "1px solid",
      borderColor: "divider",
      display: "flex", // Flex container yap
      flexDirection: "column", // Dikey hizalama
      justifyContent: "space-between", // İçeriği eşit dağıt
    }),
    []
  );

  return (
    <Paper elevation={0} sx={paperStyles}>
      {/* Başlık - orijinal hali */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 3,
            height: 16,
            borderRadius: 0.5,
            bgcolor: "primary.main",
          }}
        />
        <Typography
          component="h2"
          variant="h3"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
          Sosyal Medya
        </Typography>
      </Box>

      {/* Enhanced Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.25,
          flexGrow: 1, // Kalan alanı kapla
        }}
      >
        {socialLinks.map((item, index) => (
          <Tooltip
            key={item.name}
            title={item.username}
            arrow
            placement="top"
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(38, 38, 38, 0.95)"
                      : "rgba(97, 97, 97, 0.95)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(8px)",
                  border: "none",
                  maxWidth: "none",
                },
                "& .MuiTooltip-arrow": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(38, 38, 38, 0.95)"
                      : "rgba(97, 97, 97, 0.95)",
                },
              },
            }}
          >
            <Box
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                aspectRatio: "1/1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                borderRadius: 2,
                bgcolor: alpha(item.color, 0.08),
                border: "1px solid",
                borderColor: alpha(item.color, 0.15),
                color: "text.primary",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at center, ${alpha(
                    item.color,
                    0.1
                  )} 0%, transparent 70%)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${alpha(
                    item.color,
                    0.1
                  )}, transparent)`,
                  transition: "left 0.5s ease",
                },
                "&:hover": {
                  transform: "translateY(-3px) scale(1.03)",
                  bgcolor: alpha(item.color, 0.15),
                  borderColor: alpha(item.color, 0.3),
                  boxShadow: `0 8px 25px ${alpha(item.color, 0.25)}`,
                  "&:before": {
                    opacity: 1,
                  },
                  "&:after": {
                    left: "100%",
                  },
                  "& .icon": {
                    color: item.color,
                    transform: "scale(1.15)",
                  },
                  "& .text": {
                    transform: "translateY(-1px)",
                    fontWeight: 700,
                    color: item.color,
                  },
                },
                "&:active": {
                  transform: "translateY(-1px) scale(1.01)",
                },
              }}
            >
              {/* Badge ile star count - Sadece skeleton star count'a uygulandı */}
              {item.type === "star" ? (
                starLoading ? (
                  // Star yüklenirken Badge'ı skeleton ile göster
                  <Badge
                    badgeContent={
                      <Skeleton
                        variant="text"
                        width={12}
                        height={12}
                        sx={{ bgcolor: alpha(item.color, 0.3) }}
                      />
                    }
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: item.color,
                        color: "#000",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        padding: "0 4px",
                        borderRadius: "9px",
                        border: "2px solid",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.background.paper
                            : "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Box
                      className="icon"
                      sx={{
                        color: alpha(item.color, 0.8),
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: alpha(item.color, 0.1),
                        border: `1px solid ${alpha(item.color, 0.2)}`,
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: {
                          fontSize: 20,
                        },
                      })}
                    </Box>
                  </Badge>
                ) : (
                  // Star yüklendikten sonra normal Badge
                  <Badge
                    badgeContent={starCount}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: item.color,
                        color: "#000",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        padding: "0 4px",
                        borderRadius: "9px",
                        border: "2px solid",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.background.paper
                            : "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Box
                      className="icon"
                      sx={{
                        color: alpha(item.color, 0.8),
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: alpha(item.color, 0.1),
                        border: `1px solid ${alpha(item.color, 0.2)}`,
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: {
                          fontSize: 20,
                        },
                      })}
                    </Box>
                  </Badge>
                )
              ) : (
                // Diğer social media butonları - değişiklik yok
                <Box
                  className="icon"
                  sx={{
                    color: alpha(item.color, 0.8),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha(item.color, 0.1),
                    border: `1px solid ${alpha(item.color, 0.2)}`,
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: {
                      fontSize: 20,
                    },
                  })}
                </Box>
              )}

              <Typography
                className="text"
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "-0.25px",
                  transition: "all 0.3s ease",
                  position: "relative",
                  zIndex: 2,
                  textAlign: "center",
                }}
              >
                {item.name}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Footer Info - mt'yi azalt */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: 1.5, // 2'den 1.5'e düşürüldü
          display: "block",
          textAlign: "center",
          fontSize: "0.75rem",
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        Beni sosyal medyada takip edin
      </Typography>
    </Paper>
  );
});

export default SocialMediaBox;
