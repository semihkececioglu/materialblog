import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Tooltip,
  Divider,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import {
  Twitter,
  Facebook,
  Instagram,
  WhatsApp,
  GitHub,
} from "@mui/icons-material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { alpha } from "@mui/material/styles";

const socialLinks = [
  {
    name: "Twitter",
    icon: <Twitter />,
    color: "#1DA1F2",
    link: "https://twitter.com/",
  },
  {
    name: "GitHub",
    icon: <GitHub />,
    color: "#24292e",
    link: "https://github.com/semihkececioglu",
  },
  {
    name: "Instagram",
    icon: <Instagram />,
    color: "#E1306C",
    link: "https://instagram.com/",
  },
  {
    name: "Twitch",
    icon: <SportsEsportsIcon />,
    color: "#9146FF",
    link: "https://twitch.tv/",
  },
  {
    name: "Facebook",
    icon: <Facebook />,
    color: "#1877F2",
    link: "https://facebook.com/",
  },
  {
    name: "WhatsApp",
    icon: <WhatsApp />,
    color: "#25D366",
    link: "https://wa.me/",
  },
];

const SocialMediaBox = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 3,
            height: 16,
            borderRadius: 0.5,
            bgcolor: "primary.main",
          }}
        />
        <Typography
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
        }}
      >
        {socialLinks.map((item) => (
          <Tooltip
            key={item.name}
            title={`${item.name}'da takip et`}
            arrow
            placement="top"
          >
            <Paper
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              elevation={0}
              sx={{
                aspectRatio: "1/1", // Ensures square boxes
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                borderRadius: 1.5,
                bgcolor: alpha(item.color, 0.1),
                border: "1px solid",
                borderColor: alpha(item.color, 0.2),
                color: "text.primary",
                textDecoration: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  bgcolor: alpha(item.color, 0.15),
                  borderColor: alpha(item.color, 0.3),
                  "& .icon": {
                    color: item.color,
                    transform: "scale(1.1)",
                  },
                },
              }}
            >
              <Box
                className="icon"
                sx={{
                  color: alpha(item.color, 0.8),
                  transition: "all 0.2s ease",
                }}
              >
                {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.7rem",
                }}
              >
                {item.name}
              </Typography>
            </Paper>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default SocialMediaBox;
