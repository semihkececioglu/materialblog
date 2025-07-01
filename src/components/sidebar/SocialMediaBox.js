import React from "react";
import { Box, Typography, useTheme, Tooltip, Divider } from "@mui/material";
import {
  Twitter,
  Facebook,
  Instagram,
  WhatsApp,
  GitHub,
} from "@mui/icons-material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const socialLinks = [
  {
    name: "Twitter",
    icon: <Twitter fontSize="large" />,
    color: "#1DA1F2",
    link: "https://twitter.com/",
  },
  {
    name: "Facebook",
    icon: <Facebook fontSize="large" />,
    color: "#1877F2",
    link: "https://facebook.com/",
  },
  {
    name: "Instagram",
    icon: <Instagram fontSize="large" />,
    color: "#E1306C",
    link: "https://instagram.com/",
  },
  {
    name: "Twitch",
    icon: <SportsEsportsIcon fontSize="large" />,
    color: "#9146FF",
    link: "https://twitch.tv/",
  },
  {
    name: "Whatsapp",
    icon: <WhatsApp fontSize="large" />,
    color: "#25D366",
    link: "https://wa.me/",
  },
  {
    name: "Github",
    icon: <GitHub fontSize="large" />,
    color: "#24292e",
    link: "https://github.com/semihkececioglu",
  },
];

const SocialMediaBox = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 2,
        mt: 4,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(50,50,60,0.6), rgba(10,10,20,0.4))"
            : "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,245,245,0.6))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 15px rgba(248,28,229,0.25)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        Takip Et!
      </Typography>
      <Divider sx={{ my: 1 }} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {socialLinks.map((item) => (
          <Tooltip
            key={item.name}
            title={`Beni ${item.name} üzerinden takip et`}
            arrow
          >
            <Box
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: "32%",
                m: "0.5%",
                height: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                textDecoration: "none",
                bgcolor: "rgba(255,255,255,0.08)",
                border: `1px solid rgba(255,255,255,0.1)`,
                color: theme.palette.mode === "dark" ? "#ccc" : "#333",
                transition: "all 0.35s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  bgcolor: item.color,
                  color: "#fff",
                  boxShadow: `0 0 12px ${item.color}`,
                  svg: {
                    color: "#fff",
                  },
                },
              }}
            >
              <Box sx={{ mb: 1, color: item.color }}>{item.icon}</Box>
              <Typography variant="body2" fontWeight={500}>
                {item.name}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default SocialMediaBox;
