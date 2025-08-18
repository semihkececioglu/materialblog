import React from "react";
import { Box, Paper, Skeleton, useTheme } from "@mui/material";

const SidebarSkeleton = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Kategoriler */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(14px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.4)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={28}
            sx={{ mb: 1.5, borderRadius: 2 }}
          />
        ))}
      </Paper>

      {/* Etiketler */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(14px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.4)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Skeleton variant="text" width="50%" height={28} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={50}
              height={24}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Paper>

      {/* Popüler Yazılar */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(14px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.4)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2 }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
            <Skeleton
              variant="rectangular"
              width={64}
              height={48}
              sx={{ borderRadius: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default SidebarSkeleton;
