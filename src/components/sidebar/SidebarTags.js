import React from "react";
import { Box, Typography, Paper, useTheme, Divider, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import TagIcon from "@mui/icons-material/Tag";
import { motion } from "framer-motion";
import slugify from "../../utils/slugify";

const tags = [
  { label: "React", color: "#61dafb" },
  { label: "JavaScript", color: "#f7df1e" },
  { label: "Tasarım", color: "#ff65a3" },
];

const SidebarTags = () => {
  const theme = useTheme();

  return (
    <Paper
      component={motion.div}
      elevation={0}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 4,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(40,40,60,0.4), rgba(20,20,40,0.4))"
            : "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(245,245,255,0.4))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 8px 24px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <TagIcon fontSize="small" color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Etiketler
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={`#${tag.label}`}
            component={Link}
            to={`/tag/${slugify(tag.label)}`}
            clickable
            variant="filled"
            sx={{
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 1.8,
              py: 0.5,
              borderRadius: "20px",
              letterSpacing: 0.6,
              color: theme.palette.getContrastText(tag.color),
              bgcolor: `${tag.color}E6`,
              backdropFilter: "blur(4px)",
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.08) rotate(-1deg)",
                boxShadow: `0 6px 16px ${tag.color}66`,
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SidebarTags;
