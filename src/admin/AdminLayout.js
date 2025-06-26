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
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Outlet, Link } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", path: "/admin" },
  { text: "Yazılar", path: "/admin/posts" },
  { text: "Kategoriler", path: "/admin/categories" },
  { text: "Etiketler", path: "/admin/tags" },
  { text: "Yorumlar", path: "/admin/comments" },
  { text: "Kullanıcılar", path: "/admin/users" },
  { text: "Ayarlar", path: "/admin/settings" },
];

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Admin Panel
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1,
                mb: 1,
                px: 2,
                py: 1,
                transition: "0.2s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
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
          boxShadow: 3,
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
              sx={{ textTransform: "none" }}
            >
              Bloga Dön
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

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
            "& .MuiDrawer-paper": { width: drawerWidth },
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
              boxSizing: "border-box",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

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
