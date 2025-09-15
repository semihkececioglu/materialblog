import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
  Box,
  alpha,
} from "@mui/material";
import { Link } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import JavascriptIcon from "@mui/icons-material/Javascript";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WebIcon from "@mui/icons-material/Web";

const categories = [
  {
    name: "React",
    icon: <CodeIcon />,
    color: "#61dafb",
    count: 12,
  },
  {
    name: "Javascript",
    icon: <JavascriptIcon />,
    color: "#f7df1e",
    count: 8,
  },
  {
    name: "Tasarım",
    icon: <DesignServicesIcon />,
    color: "#ff7eb9",
    count: 5,
  },
  {
    name: "Web",
    icon: <WebIcon />,
    color: "#4CAF50",
    count: 7,
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
        borderRadius: 2,
        bgcolor: (theme) =>
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
          Kategoriler
        </Typography>
      </Box>

      <List sx={{ mx: -0.5 }}>
        {categories.map((category, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.75 }}>
            <Paper
              component={Link}
              to={`/category/${category.name.toLowerCase()}`}
              elevation={0}
              sx={{
                width: "100%",
                p: 1.5,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "text.primary",
                bgcolor: alpha(category.color, 0.1),
                border: "1px solid",
                borderColor: alpha(category.color, 0.2),
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(category.color, 0.15),
                  transform: "translateX(4px)",
                  borderColor: alpha(category.color, 0.3),
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  bgcolor: alpha(category.color, 0.2),
                  color: category.color,
                }}
              >
                {React.cloneElement(category.icon, { sx: { fontSize: 18 } })}{" "}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 0.25,
                    fontSize: "0.875rem",
                  }}
                >
                  {category.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  {category.count} yazı
                </Typography>
              </Box>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CategoryList;
