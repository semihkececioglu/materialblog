import React from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Container,
  Divider,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import FooterAbout from "../footer/FooterAbout";
import FooterLinks from "../footer/FooterLinks";
import FooterSubscribe from "../footer/FooterSubscribe";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box
      component={motion.footer}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      sx={{
        mt: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(15,25,35,0.95), rgba(25,35,50,0.9))"
              : "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(241,245,249,0.9))",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          zIndex: -1,
        },
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRadius: { xs: "20px 20px 0 0", md: "32px 32px 0 0" },
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 -8px 48px rgba(0,0,0,0.4), 0 -2px 16px rgba(0,0,0,0.2)"
            : "0 -8px 48px rgba(0,0,0,0.12), 0 -2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          <motion.div variants={itemVariants}>
            <Grid
              container
              spacing={{ xs: 3, md: 4 }}
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <FooterAbout />
              <FooterLinks />
              <FooterSubscribe />
            </Grid>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider
              sx={{
                my: { xs: 3, md: 5 },
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                height: "1.5px",
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 500,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                © {currentYear} Material UI Blog. Tüm Hakları Saklıdır.
              </Typography>

              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  textAlign: { xs: "center", sm: "right" },
                }}
              >
                React.js ile geliştirildi
              </Typography>
            </Stack>
          </motion.div>
        </Box>
      </Container>

      {/* Decorative gradient orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(56,189,248,0.1), transparent)"
              : "radial-gradient(circle, rgba(99,102,241,0.08), transparent)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(236,72,153,0.1), transparent)"
              : "radial-gradient(circle, rgba(168,85,247,0.08), transparent)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default Footer;
