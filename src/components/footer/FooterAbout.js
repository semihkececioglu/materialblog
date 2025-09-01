import React from "react";
import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import { Twitter, Facebook, Instagram, Launch } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const FooterAbout = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
    }}
  >
    {/* Brand Section */}
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
        }}
      >
        Material UI Blog
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.6,
          opacity: 0.8,
          maxWidth: "280px",
        }}
      >
        Modern, şık ve kullanıcı dostu bir blog deneyimi sunmayı amaçlıyoruz. En
        güncel teknolojilerle geliştirilmiştir.
      </Typography>
    </Box>

    {/* Social Media Section */}
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1,
          fontWeight: 500,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Bizi Takip Edin
      </Typography>

      <Stack direction="row" spacing={1}>
        {[
          {
            icon: Twitter,
            label: "Twitter",
            href: "https://twitter.com",
            color: "#1DA1F2",
          },
          {
            icon: Facebook,
            label: "Facebook",
            href: "https://facebook.com",
            color: "#4267B2",
          },
          {
            icon: Instagram,
            label: "Instagram",
            href: "https://instagram.com",
            color: "#E4405F",
          },
        ].map(({ icon: Icon, label, href, color }) => (
          <Tooltip key={label} title={label} arrow placement="top">
            <IconButton
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha(color, 0.2),
                color: "text.secondary",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  color: color,
                  borderColor: alpha(color, 0.4),
                  backgroundColor: alpha(color, 0.04),
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(color, 0.15)}`,
                },
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    </Box>

    {/* Newsletter CTA */}
    <Box
      sx={{
        mt: "auto",
        p: 2,
        borderRadius: 2,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.main, 0.02),
        border: (theme) =>
          `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)",
          backgroundSize: "200% 100%",
          animation: "gradient 3s ease infinite",
          "@keyframes gradient": {
            "0%, 100%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
          },
        }}
      />

      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          mb: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        Haberdar Olun
        <Launch fontSize="inherit" />
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ opacity: 0.7 }}
      >
        Yeni yazılarımızdan ilk siz haberdar olun
      </Typography>
    </Box>
  </Box>
);

export default FooterAbout;
