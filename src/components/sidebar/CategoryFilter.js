import React from "react";
import { Typography, List, ListItemButton } from "@mui/material";

const categories = ["React", "JavaScript", "UI/UX", "Next.js"];

const CategoryFilter = () => {
  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        📌 Kategoriler
      </Typography>
      <List dense>
        {categories.map((cat) => (
          <ListItemButton key={cat}>{cat}</ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default CategoryFilter;
