import React, { useMemo } from "react";
import { Box, Typography, ButtonBase } from "@mui/material";
import { Home, Info, ContactMail, ArrowOutward } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const FooterLinks = React.memo(() => {
  const links = useMemo(
    () => [
      {
        label: "Ana Sayfa",
        href: "/",
        icon: Home,
        description: "Blog anasayfası",
      },
      {
        label: "Hakkımızda",
        href: "/about",
        icon: Info,
        description: "Biz kimiz?",
      },
      {
        label: "İletişim",
        href: "/contact",
        icon: ContactMail,
        description: "Bizimle iletişime geçin",
      },
    ],
    []
  );

  // Compact styles
  const containerStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      height: "100%",
    }),
    []
  );
  const titleStyles = useMemo(
    () => ({
      fontWeight: 600,
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "1rem",
      mb: 0.5,
    }),
    []
  );

  <Typography variant="h6" sx={titleStyles}>
    Sayfalar
  </Typography>;

  const LinkButton = useMemo(
    () =>
      React.memo(({ link }) => (
        <ButtonBase
          href={link.href}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            p: 1,
            borderRadius: 1.5,
            textAlign: "left",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.02)",
            border: "1px solid transparent",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha("#2196F3", 0.2),
              transform: "translateX(3px)", // Küçültüldü: 4px → 3px
              boxShadow: `0 3px 10px ${alpha("#2196F3", 0.12)}`, // Küçültüldü
              "& .icon": {
                color: "primary.main",
                transform: "scale(1.05)", // Küçültüldü: 1.1 → 1.05
              },
              "& .arrow": {
                transform: "translate(2px, -2px)",
                opacity: 1,
              },
              "& .title": {
                color: "primary.main",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {" "}
            {/* Küçültüldü: 1.5 → 1 */}
            <Box
              sx={{
                width: 28, // Küçültüldü: 32 → 28
                height: 28,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
              }}
            >
              <link.icon
                className="icon"
                sx={{
                  fontSize: 14, // Küçültüldü: 16 → 14
                  color: "text.secondary",
                  transition: "all 0.3s ease",
                }}
              />
            </Box>
            <Box>
              <Typography
                className="title"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8rem", // Küçültüldü: 0.875rem → 0.8rem
                  color: "text.primary",
                  transition: "color 0.3s ease",
                  lineHeight: 1.2,
                }}
              >
                {link.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem", // Küçültüldü: 0.7rem → 0.65rem
                  color: "text.secondary",
                  opacity: 0.7,
                  lineHeight: 1.1,
                }}
              >
                {link.description}
              </Typography>
            </Box>
          </Box>

          <ArrowOutward
            className="arrow"
            sx={{
              fontSize: 12, // Küçültüldü: 14 → 12
              color: "text.secondary",
              opacity: 0.5,
              transition: "all 0.3s ease",
            }}
          />
        </ButtonBase>
      )),
    []
  );

  return (
    <Box sx={containerStyles}>
      {/* Header - Newsletter ile aynı yapı */}
      <Box>
        <Typography variant="h6" sx={titleStyles}>
          Sayfalar
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {links.map((link) => (
          <LinkButton key={link.label} link={link} />
        ))}
      </Box>
    </Box>
  );
});

FooterLinks.displayName = "FooterLinks";
export default FooterLinks;
