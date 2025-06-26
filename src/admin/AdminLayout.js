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

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { text: "Yazılar", path: "/admin/posts", icon: <ArticleIcon /> },
  { text: "Kategoriler", path: "/admin/categories", icon: <CategoryIcon /> },
  { text: "Etiketler", path: "/admin/tags", icon: <TagIcon /> },
  { text: "Yorumlar", path: "/admin/comments", icon: <CommentIcon /> },
  { text: "Kullanıcılar", path: "/admin/users", icon: <PeopleIcon /> },
  { text: "Ayarlar", path: "/admin/settings", icon: <SettingsIcon /> },
];

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Admin Panel
      </Typography>
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem disablePadding key={item.text}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                  py: 1,
                  transition: "0.2s",
                  backgroundColor: isActive
                    ? "rgba(25, 118, 210, 0.1)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    transform: "scale(1.02)",
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
                    color: isActive ? "primary.main" : "text.primary",
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

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: theme.palette.mode === "dark" ? "#1f1f1f" : "#1976d2",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
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

      {/* DRAWER */}
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
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
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
