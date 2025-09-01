import React from "react";
import { Box, Typography, Paper, useTheme, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import slugify from "../../utils/slugify";

const tags = [
  { label: "React", count: 12, color: "#61dafb" },
  { label: "JavaScript", count: 8, color: "#f0db4f" },
  { label: "Tasarım", count: 5, color: "#ff6b6b" },
  { label: "TypeScript", count: 4, color: "#3178c6" },
  { label: "Node.js", count: 6, color: "#68a063" },
  { label: "CSS", count: 7, color: "#1572b6" },
];

const SidebarTags = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Başlık */}
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
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
          Etiketler
        </Typography>
      </Box>

      {/* Etiketler */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tags.map((tag, index) => {
          return (
            <Chip
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {tag.label}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 400,
                      color: "text.secondary",
                      opacity: 0.9,
                    }}
                  >
                    {tag.count}
                  </Typography>
                </Box>
              }
              component={Link}
              to={`/tag/${slugify(tag.label)}`}
              clickable
              size="small"
              sx={{
                height: 28,
                borderRadius: 2,
                px: 1,
                // Glassmorphism efekti + hafif renk
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(tag.color, 0.1)
                    : alpha(tag.color, 0.08),
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(tag.color, 0.2)
                    : alpha(tag.color, 0.15),
                // İyi kontrast için text renkleri
                color: "text.primary",
                fontWeight: 500,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  // Hover'da daha belirgin glassmorphism + renk
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(tag.color, 0.2)
                      : alpha(tag.color, 0.15),
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(tag.color, 0.4)
                      : alpha(tag.color, 0.3),
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? `0 8px 32px ${alpha(tag.color, 0.2)}`
                      : `0 8px 32px ${alpha(tag.color, 0.15)}`,
                  "& .MuiChip-label": {
                    color: "text.primary",
                  },
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default SidebarTags;
