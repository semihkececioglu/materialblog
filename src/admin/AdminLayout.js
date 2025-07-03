import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/LocalOffer";
import CommentIcon from "@mui/icons-material/Comment";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector((state) => state.user.currentUser);

  const navItems = [
    { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { text: "Yazılar", path: "/admin/posts", icon: <ArticleIcon /> },
    { text: "Kategoriler", path: "/admin/categories", icon: <CategoryIcon /> },
    { text: "Etiketler", path: "/admin/tags", icon: <TagIcon /> },
    { text: "Yorumlar", path: "/admin/comments", icon: <CommentIcon /> },
    { text: "Kullanıcılar", path: "/admin/users", icon: <PeopleIcon /> },
    { text: "Ayarlar", path: "/admin/settings", icon: <SettingsIcon /> },
  ];

  // ✅ Rol kontrolü: sadece admin veya editor girebilir
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Bu sayfaya erişim yetkiniz yok.
        </Typography>
      </Box>
    );
  }

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Admin Panel
      </Typography>
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          const isDisabled =
            user?.role === "editor" && item.path !== "/admin/posts"; // 👈 sadece "Yazılar" açık

          return (
            <ListItem disablePadding key={item.text}>
              <ListItemButton
                component={isDisabled ? "div" : Link}
                to={isDisabled ? undefined : item.path}
                onClick={() => !isDisabled && setMobileOpen(false)}
                disabled={isDisabled}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                  py: 1,
                  transition: "transform 0.2s ease, background-color 0.2s ease",
                  backgroundColor: isActive
                    ? theme.palette.action.selected
                    : "transparent",
                  opacity: isDisabled ? 0.5 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  pointerEvents: isDisabled ? "none" : "auto",
                  "&:hover": {
                    bgcolor: isDisabled
                      ? "transparent"
                      : theme.palette.action.hover,
                    transform: isDisabled ? "none" : "scale(1.02)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : 500,
                    color: isDisabled
                      ? theme.palette.text.disabled
                      : isActive
                      ? "primary.main"
                      : "text.primary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 28, 0.7)"
              : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          color: theme.palette.text.primary,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
        elevation={0}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600, flexGrow: 1 }}
          >
            Material Blog
          </Typography>

          <Tooltip title="Blog Ana Sayfasına Git">
            <Button
              color="inherit"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenInNewIcon />}
              sx={{ textTransform: "none", ml: 1 }}
            >
              Bloga Dön
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* DRAWER – MOBILE */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(18,18,28,0.85)"
                  : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* DRAWER – DESKTOP */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(18,18,28,0.85)"
                  : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "background.default",
          px: { xs: 2, md: 3 },
          pb: 5,
          pt: { xs: 4, md: 6 },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
