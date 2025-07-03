import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Twitter, Facebook, Instagram } from "@mui/icons-material";

const FooterAbout = () => (
  <Box item xs={12} sm={6} md={3}>
    <Typography variant="h6" gutterBottom>
      Material UI Blog
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Modern, sade ve kullanıcı dostu bir blog deneyimi sunmayı amaçlıyoruz.
    </Typography>
    <Box sx={{ mt: 2 }}>
      <IconButton color="inherit" href="https://twitter.com" target="_blank">
        <Twitter />
      </IconButton>
      <IconButton color="inherit" href="https://facebook.com" target="_blank">
        <Facebook />
      </IconButton>
      <IconButton color="inherit" href="https://instagram.com" target="_blank">
        <Instagram />
      </IconButton>
    </Box>
  </Box>
);

export default FooterAbout;
