import React from "react";
import { Typography, List, ListItemText, ListItemButton } from "@mui/material";

const posts = [
  "React Hooks ile Durum Yönetimi",
  "JavaScript'te Map vs. ForEach",
  "Material UI ile Temel Tasarım",
];

const PopularPosts = () => {
  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        📈 Popüler Yazılar
      </Typography>
      <List dense>
        {posts.map((title, index) => (
          <ListItemButton key={index}>
            <ListItemText primary={title} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default PopularPosts;
