import React from "react";
import { Box, Paper, Skeleton, Stack, useTheme } from "@mui/material";

export const SidebarSkeleton = () => {
  const theme = useTheme();
  return (
    <Stack spacing={3}>
      {[...Array(3)].map((_, i) => (
        <Paper
          key={i}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
          }}
        >
          <Skeleton variant="text" height={24} width="60%" />
          <Stack spacing={1.2} mt={1}>
            {[...Array(4)].map((__, j) => (
              <Skeleton key={j} variant="text" height={18} />
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

const PostDetailSkeleton = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 3 }}>
      {/* Kapak */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          aspectRatio: "16/9",
          mb: 3,
          boxShadow: theme.shadows[2],
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>

      {/* İçerik kartı */}
      <Paper
        id="post-paper"
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
        }}
      >
        {/* Başlık */}
        <Stack spacing={1} mb={2}>
          <Skeleton variant="text" height={36} width="85%" />
          <Skeleton variant="text" height={28} width="55%" />
        </Stack>

        {/* Yazar bilgisi */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Skeleton variant="circular" width={44} height={44} />
          <Stack spacing={0.5} flex={1}>
            <Skeleton variant="text" height={18} width={180} />
            <Skeleton variant="text" height={16} width={120} />
          </Stack>
          <Skeleton variant="rounded" width={96} height={28} />
        </Stack>

        {/* İçerik */}
        <Stack spacing={1.2}>
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={20}
              width={i % 3 === 0 ? "92%" : "100%"}
            />
          ))}
          <Skeleton variant="rectangular" height={220} sx={{ my: 1.5 }} />
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={20}
              width={i % 4 === 0 ? "88%" : "100%"}
            />
          ))}
        </Stack>

        {/* Interaction bar */}
        <Stack direction="row" spacing={1.5} mt={3}>
          <Skeleton variant="rounded" width={96} height={36} />
          <Skeleton variant="rounded" width={96} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Stack>
      </Paper>

      {/* Benzer yazılar */}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" height={24} width={180} />
        <Stack direction="row" spacing={2} mt={1} sx={{ flexWrap: "wrap" }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={260}
              height={160}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Yorumlar */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
        }}
      >
        <Skeleton variant="text" height={24} width={160} sx={{ mb: 2 }} />
        {[...Array(3)].map((_, i) => (
          <Stack key={i} direction="row" spacing={2} mb={2}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={180} height={18} />
              <Skeleton variant="text" width="100%" height={18} />
              <Skeleton variant="text" width="90%" height={18} />
            </Box>
          </Stack>
        ))}
        <Skeleton variant="rounded" height={44} />
      </Paper>
    </Box>
  );
};

export default PostDetailSkeleton;
