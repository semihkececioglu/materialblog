import React, { useMemo } from "react";
import { Box } from "@mui/material";
import CategoryList from "./CategoryList"; // Direkt import
import SocialMediaBox from "./SocialMediaBox"; // Direkt import
import SidebarTags from "./SidebarTags"; // Direkt import

const Sidebar = React.memo(() => {
  const containerStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 0,
      minHeight: 800, // Fixed minimum height
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
