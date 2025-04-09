import { Typography, Box, useTheme } from "@mui/material";
import React from "react";

function Footer() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 Material UI Blog. Tüm hakları saklıdır.
      </Typography>
    </Box>
  );
}

export default Footer;
