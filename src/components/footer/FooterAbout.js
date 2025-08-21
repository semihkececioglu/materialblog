import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Twitter, Facebook, Instagram } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const FooterAbout = () => (
  <Box item xs={12} sm={6} md={3}>
    <Typography variant="h6" gutterBottom>
      Material UI Blog
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Modern, sade ve kullanıcı dostu bir blog deneyimi sunmayı amaçlıyoruz.
    </Typography>
    <Box sx={{ mt: 2 }}>
      <Tooltip title="Twitter" arrow>
        <IconButton
          color="inherit"
          href="https://twitter.com"
          target="_blank"
          aria-label="Twitter"
        >
          <Twitter />
        </IconButton>
      </Tooltip>

      <Tooltip title="Facebook" arrow>
        <IconButton
          color="inherit"
          href="https://facebook.com"
          target="_blank"
          aria-label="Facebook"
        >
          <Facebook />
        </IconButton>
      </Tooltip>

      <Tooltip title="Instagram" arrow>
        <IconButton
          color="inherit"
          href="https://instagram.com"
          target="_blank"
          aria-label="Instagram"
        >
          <Instagram />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
);

export default FooterAbout;
