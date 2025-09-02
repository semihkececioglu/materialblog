import React, { useState, useEffect } from "react";
import { Zoom, Fab, useTheme, alpha } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Önceki/Sonraki yazılar bölümünü bul
      const nextPrevSection = document.querySelector(
        '.navigation-posts, .next-prev-posts, .post-navigation, [class*="navigation"], [class*="next-prev"]'
      );

      // Eğer navigation section bulunamazsa, sayfa sonuna yakın bir mesafeyi kullan
      let targetPosition = window.innerHeight * 2; // Default: 2 viewport height

      if (nextPrevSection) {
        targetPosition = nextPrevSection.offsetTop - window.innerHeight;
      } else {
        // Alternatif: Sayfa sonundan belirli bir mesafe
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        targetPosition = documentHeight - windowHeight * 1.5;
      }

      // Kullanıcı target pozisyona ulaştığında göster
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > Math.max(targetPosition, 0));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0,
            y: 20,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            scale: {
              type: "spring",
              stiffness: 200,
              damping: 15,
            },
          }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1200,
          }}
        >
          <Fab
            size="medium"
            onClick={handleClick}
            sx={{
              // Glassmorphism Background
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.08)",

              // Enhanced shadows
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                  : "0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",

              // Colors
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.9)"
                  : theme.palette.primary.main,

              // Hover & Active States
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

              "&:hover": {
                transform: "translateY(-2px) scale(1.05)",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.95)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 12px 48px rgba(0, 0, 0, 0.5), 0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                    : "0 12px 48px rgba(0, 0, 0, 0.2), 0 4px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.12)",
              },

              "&:active": {
                transform: "translateY(0px) scale(0.98)",
                transition: "all 0.1s ease",
              },

              // Pulse animation on first appearance
              "@keyframes pulse": {
                "0%": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 0 0 0 rgba(255, 255, 255, 0.3)"
                      : `0 0 0 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                },
                "70%": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 0 0 10px rgba(255, 255, 255, 0)"
                      : `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
                },
                "100%": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 0 0 0 rgba(255, 255, 255, 0)"
                      : `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
                },
              },

              animation: "pulse 2s infinite",
              animationDelay: "0.5s",

              // Mobile optimizations
              [theme.breakpoints.down("sm")]: {
                right: 16,
                bottom: 16,
                width: 48,
                height: 48,
              },
            }}
          >
            <KeyboardArrowUpIcon
              sx={{
                fontSize: { xs: 20, sm: 24 },
                transition: "all 0.2s ease",
              }}
            />
          </Fab>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
