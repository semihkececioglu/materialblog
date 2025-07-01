import React from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import JavascriptIcon from "@mui/icons-material/Javascript";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => {
      const map = {
        ç: "c",
        Ç: "c",
        ğ: "g",
        Ğ: "g",
        ı: "i",
        İ: "i",
        ö: "o",
        Ö: "o",
        ş: "s",
        Ş: "s",
        ü: "u",
        Ü: "u",
      };
      return map[c] || c;
    })
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const categories = [
  {
    name: "React",
    icon: <CodeIcon />,
    color: "#61dafb",
  },
  {
    name: "JavaScript",
    icon: <JavascriptIcon />,
    color: "#f7df1e",
  },
  {
    name: "Tasarım",
    icon: <DesignServicesIcon />,
    color: "#ff7eb9",
  },
];

const CategoryList = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 3,
        backdropFilter: "blur(12px)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(30,30,30,0.6)"
            : "rgba(255,255,255,0.6)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        Kategoriler
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List disablePadding>
        {categories.map((category, index) => (
          <ListItem
            key={index}
            component={Link}
            to={`/category/${toSlug(category.name)}`}
            sx={{
              mb: 2,
              borderRadius: 2,
              px: 2,
              py: 1.5,
              backdropFilter: "blur(8px)",
              backgroundColor: `${category.color}22`,
              border: `1px solid ${category.color}66`,
              color: theme.palette.getContrastText(category.color),
              transition: "all 0.3s ease",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              "&:hover": {
                transform: "scale(1.03)",
                backgroundColor: `${category.color}44`,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
              {category.icon}
            </ListItemIcon>
            <ListItemText
              primary={category.name}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CategoryList;
