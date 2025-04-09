import React from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const categories = ["React", "JavaScript", "Tasarım"];

const Sidebar = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[300]
        }`,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Kategoriler
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List dense>
        {categories.map((category) => (
          <ListItem
            key={category}
            button
            component={Link}
            to={`/category/${category.toLowerCase()}`}
          >
            <ListItemText primary={category} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
