import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PostCardSkeleton from "./PostCardSkeleton";

const PostCardSkeletonList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const skeletonCount = isMobile ? 2 : isTablet ? 4 : 6;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // mobil
          sm: "1fr 1fr", // tablet
          md: "1fr 1fr 1fr", // desktop
        },
        gap: 2,
      }}
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </Box>
  );
};

export default PostCardSkeletonList;
