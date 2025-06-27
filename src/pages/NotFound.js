import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 4, sm: 6 },
          maxWidth: 500,
          width: "100%",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.1)"
            }`,
          textAlign: "center",
        }}
      >
        <Typography variant="h2" fontWeight="bold" color="primary">
          404
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          Sayfa Bulunamadı
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Ana Sayfaya Git
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
