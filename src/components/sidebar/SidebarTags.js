import React from "react";
import { Box, Typography, Paper, useTheme, Divider, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import TagIcon from "@mui/icons-material/Tag";
import { motion } from "framer-motion";

const tags = [
  { label: "React", color: "#61dafb" },
  { label: "JavaScript", color: "#f7df1e" },
  { label: "Tasarım", color: "#ff65a3" },
  { label: "CSS", color: "#2965f1" },
  { label: "Node.js", color: "#3c873a" },
];

const SidebarTags = () => {
  const theme = useTheme();

  return (
    <Paper
      component={motion.div}
      elevation={4}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <TagIcon fontSize="small" color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Etiketler
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={`#${tag.label}`}
            component={Link}
            to={`/tag/${tag.label.toLowerCase()}`}
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
              bgcolor: tag.color,
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.08) rotate(-1deg)",
                boxShadow: `0 6px 12px ${tag.color}66`,
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SidebarTags;
