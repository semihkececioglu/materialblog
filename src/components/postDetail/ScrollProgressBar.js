import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";

const ScrollProgressBar = () => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

  // rAF throttling + cache
  const tickingRef = useRef(false);
  const lastYRef = useRef(0);
  const maxScrollRef = useRef(1);

  useEffect(() => {
    const recalcMax = () => {
      // Bu hesap pahalı; sadece resize/load’ta yap
      const doc = document.documentElement;
      maxScrollRef.current = Math.max(1, doc.scrollHeight - doc.clientHeight);
    };

    const onScroll = () => {
      // Sadece değeri okuyup rAF’e bırak
      lastYRef.current = window.scrollY || window.pageYOffset || 0;

      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(() => {
          const pct = (lastYRef.current / maxScrollRef.current) * 100;
          // clamp
          const clamped = pct < 0 ? 0 : pct > 100 ? 100 : pct;
          setProgress(clamped);
          tickingRef.current = false;
        });
      }
    };

    // İlk değerler
    recalcMax();
    onScroll();

    // passive: true → tarayıcı kaydırmayı bloklamaz
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recalcMax, { passive: true });
    window.addEventListener("load", recalcMax, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recalcMax);
      window.removeEventListener("load", recalcMax);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        zIndex: 1500,
        backgroundColor: "transparent",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {/* Genişlik yerine transform: scaleX → reflow değil, composite */}
      <Box
        sx={{
          height: "100%",
          transformOrigin: "left center",
          transform: `scaleX(${progress / 100})`,
          willChange: "transform",
          backgroundImage: "linear-gradient(to right, #41295a, #2F0743)",
          borderRadius: 0.5,
          // daha pürüzsüz animasyon; reflow tetiklemez
          transition: "transform 60ms linear",
        }}
      />
    </Box>
  );
};

export default ScrollProgressBar;
