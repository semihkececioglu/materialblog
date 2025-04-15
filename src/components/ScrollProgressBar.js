import React, { useEffect, useState } from "react";
import { LinearProgress, Box, useTheme } from "@mui/material";

const ScrollProgressBar = () => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1500,
        backgroundColor: "transparent",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          backgroundColor: "transparent",
          "& .MuiLinearProgress-bar": {
            backgroundImage: "linear-gradient(to right, #00c6ff, #0072ff)",
            transition: "all 0.3s ease",
          },
        }}
      />
    </Box>
  );
};

export default ScrollProgressBar;
