import React, { useMemo } from "react";
import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import { Twitter, Facebook, Instagram, Launch } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import XIcon from "@mui/icons-material/X";

const FooterAbout = React.memo(() => {
  const socialLinks = useMemo(
    () => [
      {
        icon: XIcon,
        label: "X (Twitter)",
        href: "https://twitter.com",
        color: "#1DA1F2",
      },
      {
        icon: Facebook,
        label: "Facebook",
        href: "https://facebook.com",
        color: "#1877F2",
      },
      {
        icon: Instagram,
        label: "Instagram",
        href: "https://instagram.com",
        color: "#E4405F",
      },
    ],
    []
  );

  // Clean styles
  const containerStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
    }),
    []
  );

  const brandStyles = useMemo(
    () => ({
      fontWeight: 700,
      fontSize: "1.2rem",
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      mb: 1,
    }),
    []
  );

  const SocialIcon = useMemo(
    () =>
      React.memo(({ icon: Icon, label, href, color }) => (
        <Tooltip title={label} arrow>
          <IconButton
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha(color, 0.2),
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                color: color,
                borderColor: alpha(color, 0.4),
                backgroundColor: alpha(color, 0.08),
                transform: "translateY(-2px)",
              },
            }}
          >
            <Icon fontSize="small" />
          </IconButton>
        </Tooltip>
      )),
    []
  );

  return (
    <Box sx={containerStyles}>
      {/* Brand */}
      <Box>
        <Typography variant="h3" sx={brandStyles}>
          MUI BLOG
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            opacity: 0.8,
            fontSize: "0.875rem",
          }}
        >
          Modern ve kullanıcı dostu blog deneyimi.
        </Typography>
      </Box>

      {/* Social Media */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: "0.8rem",
          }}
        >
          Takip Edin
        </Typography>

        <Stack direction="row" spacing={1}>
          {socialLinks.map((social) => (
            <SocialIcon key={social.label} {...social} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
});

FooterAbout.displayName = "FooterAbout";
export default FooterAbout;
