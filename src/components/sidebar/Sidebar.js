import React, { useMemo } from "react";
import { Box } from "@mui/material";
import SocialMediaBox from "./SocialMediaBox";
import CategoryList from "./CategoryList";
import SidebarTags from "./SidebarTags";

const Sidebar = React.memo(() => {
  const containerStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 0,
      contain: "layout style paint", // Browser optimizasyonu
      willChange: "auto", // GPU acceleration sadece gerektiğinde
    }),
    []
  );

  return (
    <Box sx={containerStyles}>
      <CategoryList />
      <SocialMediaBox />
      <SidebarTags />
    </Box>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
