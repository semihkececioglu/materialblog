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

const categories = [
  {
    name: "React",
    icon: <CodeIcon />,
    bgImage: "linear-gradient(135deg, #61dafb 0%, #21a1f1 100%)",
  },
  {
    name: "JavaScript",
    icon: <JavascriptIcon />,
    bgImage: "linear-gradient(135deg, #f7df1e 0%, #ffd700 100%)",
  },
  {
    name: "Tasarım",
    icon: <DesignServicesIcon />,
    bgImage: "linear-gradient(135deg, #ff7eb9 0%, #ff65a3 100%)",
  },
];

const CategoryList = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 2,
        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[300]
        }`,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Kategoriler
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List disablePadding>
        {categories.map((category, index) => (
          <ListItem
            key={index}
            component={Link}
            to={`/category/${category.name.toLowerCase()}`}
            sx={{
              mb: 2,
              borderRadius: 2,
              px: 2,
              py: 1.5,
              background: category.bgImage,
              color: theme.palette.getContrastText("#ffffff"),
              transition: "all 0.3s ease",
              textDecoration: "none",
              boxShadow: 3,
              "&:hover": {
                transform: "scale(1.02)",
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
