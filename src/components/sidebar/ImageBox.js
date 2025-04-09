import React from "react";
import { Box } from "@mui/material";

const ImageBox = () => {
  return (
    <Box
      component="img"
      src="https://via.placeholder.com/300x150.png?text=Reklam+Alan%C4%B1"
      alt="Sidebar Görsel"
      sx={{ width: "100%", borderRadius: 2 }}
    />
  );
};

export default ImageBox;
