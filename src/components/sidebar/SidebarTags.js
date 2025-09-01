import React from "react";
import { Box, Typography, Paper, useTheme, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import slugify from "../../utils/slugify";

const tags = [
  { label: "React", color: "#61dafb", count: 12 },
  { label: "JavaScript", color: "#f7df1e", count: 8 },
  { label: "Tasarım", color: "#ff65a3", count: 5 },
  { label: "TypeScript", color: "#3178c6", count: 4 },
  { label: "Node.js", color: "#68a063", count: 6 },
  { label: "CSS", color: "#264de4", count: 7 },
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
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#fff", // sabit beyaz yazı
                  }}
                >
                  {tag.label}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.85)", // beyazın yumuşatılmış tonu
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
              height: 26,
              borderRadius: 1.5,
              px: 0.6,
              bgcolor:
                theme.palette.mode === "dark"
                  ? alpha(tag.color, 0.4) // dark mode için daha açık
                  : alpha(tag.color, 0.6), // light mode için daha koyu
              color: "#fff",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? alpha(tag.color, 0.55)
                  : alpha(tag.color, 0.7),
              fontWeight: 500,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(tag.color, 0.55)
                    : alpha(tag.color, 0.75),
                borderColor:
                  theme.palette.mode === "dark"
                    ? alpha(tag.color, 0.7)
                    : alpha(tag.color, 0.9),
                transform: "translateY(-1px)",
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SidebarTags;
