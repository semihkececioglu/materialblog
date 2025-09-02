import React, { useState, useEffect } from "react";
import { Box, Typography, Button, useTheme, Fade, Grow } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const NotFound = () => {
  const theme = useTheme();
  const [floatingElements, setFloatingElements] = useState([]);

  // Floating particles effect
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 50%, #1a237e 0%, #000051 25%, #0d1117 75%)"
            : "radial-gradient(circle at 20% 50%, #e3f2fd 0%, #bbdefb 25%, #f5f5f5 75%)",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {/* Floating Particles */}
      {floatingElements.map((element) => (
        <Box
          key={element.id}
          sx={{
            position: "absolute",
            width: { xs: 4, sm: 6 },
            height: { xs: 4, sm: 6 },
            borderRadius: "50%",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            left: `${element.x}%`,
            top: `${element.y}%`,
            animation: `float ${element.duration}s ease-in-out infinite ${element.delay}s`,
            opacity: 0.6,
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px) rotate(0deg)",
              },
              "50%": {
                transform: "translateY(-20px) rotate(180deg)",
              },
            },
          }}
        />
      ))}

      {/* Main Content */}
      <Box
        sx={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          px: 3,
        }}
      >
        {/* Animated 404 */}
        <Fade in timeout={1000}>
          <Box sx={{ position: "relative", mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "8rem", sm: "12rem", md: "16rem" },
                fontWeight: 900,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.05em",
                lineHeight: 0.8,
                position: "relative",
                filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    transform: "scale(1)",
                  },
                  "50%": {
                    transform: "scale(1.05)",
                  },
                },
              }}
            >
              404
            </Typography>

            {/* Glitch Effect Lines */}
            <Box
              sx={{
                position: "absolute",
                top: "30%",
                left: "10%",
                right: "10%",
                height: 2,
                background: theme.palette.error.main,
                animation: "glitch 1.5s ease-in-out infinite",
                "@keyframes glitch": {
                  "0%, 100%": {
                    opacity: 0,
                    transform: "translateX(0)",
                  },
                  "10%, 90%": {
                    opacity: 1,
                    transform: "translateX(-5px)",
                  },
                  "50%": {
                    opacity: 1,
                    transform: "translateX(5px)",
                  },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "70%",
                left: "20%",
                right: "20%",
                height: 2,
                background: theme.palette.warning.main,
                animation: "glitch 1.5s ease-in-out infinite 0.5s",
              }}
            />
          </Box>
        </Fade>

        {/* Creative Message */}
        <Grow in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontSize: { xs: "1.8rem", sm: "2.5rem" },
              }}
            >
              Oops! Kaybolmuş gibiyiz!
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Bu sayfa dijital uzayın derinliklerinde kaybolmuş. Ama merak etme,
              seni güvenli bir yere götürebiliriz!
            </Typography>
          </Box>
        </Grow>

        {/* Interactive Buttons */}
        <Grow in timeout={1500}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              component={Link}
              to="/"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: 50,
                px: 5,
                py: 2,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1.1rem",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "white",
                minWidth: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  transition: "left 0.6s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
            >
              Ana Üsse Dön
            </Button>

            <Button
              variant="outlined"
              component={Link}
              to="/search"
              size="large"
              startIcon={<ExploreIcon />}
              sx={{
                borderRadius: 50,
                px: 5,
                py: 2,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1.1rem",
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
                color: theme.palette.primary.main,
                minWidth: 200,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-3px) scale(1.05)",
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                },
              }}
            >
              Keşfet
            </Button>
          </Box>
        </Grow>

        {/* Fun Footer */}
        <Fade in timeout={2000}>
          <Box sx={{ mt: 6 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                borderRadius: 5,
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
              }}
            >
              <AutoFixHighIcon
                sx={{
                  color: theme.palette.primary.main,
                  animation: "sparkle 2s ease-in-out infinite",
                  "@keyframes sparkle": {
                    "0%, 100%": {
                      transform: "rotate(0deg) scale(1)",
                    },
                    "50%": {
                      transform: "rotate(180deg) scale(1.2)",
                    },
                  },
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Bu sayfanın varlığı kuantum fiziğiyle açıklanamaz
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default NotFound;
