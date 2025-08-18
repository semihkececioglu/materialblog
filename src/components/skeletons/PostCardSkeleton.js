import React from "react";
import { Card, Box, Skeleton, useTheme } from "@mui/material";

const PostCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        height: 360,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 4,
        overflow: "hidden",
        backdropFilter: "blur(16px)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.4)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Görsel alanı */}
      <Skeleton variant="rectangular" height={140} animation="wave" />

      <Box sx={{ px: 2, pt: 1.5 }}>
        {/* Chip */}
        <Skeleton variant="rounded" width={72} height={24} animation="wave" />

        {/* Başlık */}
        <Skeleton
          variant="text"
          sx={{ mt: 1 }}
          width="85%"
          height={28}
          animation="wave"
        />

        {/* Özet satırları */}
        <Skeleton variant="text" width="95%" height={20} animation="wave" />
        <Skeleton variant="text" width="70%" height={20} animation="wave" />
      </Box>

      {/* Alt bar */}
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Skeleton variant="text" width={120} height={18} animation="wave" />
        <Skeleton variant="rounded" width={40} height={36} animation="wave" />
      </Box>
    </Card>
  );
};

export default PostCardSkeleton;
