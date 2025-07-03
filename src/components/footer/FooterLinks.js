import React from "react";
import { Box, Typography, Link } from "@mui/material";

const FooterLinks = () => (
  <Box item xs={12} sm={6} md={3}>
    <Typography variant="h6" gutterBottom>
      Bağlantılar
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Link href="/" color="inherit" underline="hover">
        Ana Sayfa
      </Link>
      <Link href="/category/react" color="inherit" underline="hover">
        React
      </Link>
      <Link href="/category/javascript" color="inherit" underline="hover">
        Javascript
      </Link>
    </Box>
  </Box>
);

export default FooterLinks;
