import React from "react";
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
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", path: "/admin" },
  { text: "Yazılar", path: "/admin/posts" },
  { text: "Kategoriler", path: "/admin/categories" },
  { text: "Etiketler", path: "/admin/tags" },
  { text: "Yorumlar", path: "/admin/comments" },
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
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
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
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
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
          bgcolor: "background.paper",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderBottom: `1px solid ${theme.palette.divider}`,
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
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
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

        {/* Desktop Drawer */}
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
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
