import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import FooterAbout from "../footer/FooterAbout";
import FooterLinks from "../footer/FooterLinks";
import FooterSubscribe from "../footer/FooterSubscribe";
import { Link } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component={motion.footer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        mt: 10,
        px: { xs: 2, sm: 4 },
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(40,50,60,0.6), rgba(20,30,50,0.5))"
            : "linear-gradient(135deg, rgba(255,210,255,0.65), rgba(210,255,255,0.65))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px 24px 0 0",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 -4px 32px rgba(0,0,0,0.3)"
            : "0 -4px 32px rgba(0,0,0,0.1)",
        color: theme.palette.text.primary,
      }}
    >
      <Grid container spacing={4} justifyContent="space-between">
        <FooterAbout />
        <FooterLinks />
        <FooterSubscribe />
      </Grid>

      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mt: 6 }}
      >
        © {currentYear} Material UI Blog. Tüm Hakları Saklıdır.
      </Typography>
    </Box>
  );
};

export default Footer;
