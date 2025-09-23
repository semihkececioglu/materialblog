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
  Avatar,
  Stack,
  Menu,
  MenuItem,
  Divider,
  Breadcrumbs,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/LocalOffer";
import CommentIcon from "@mui/icons-material/Comment";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AddIcon from "@mui/icons-material/Add";
import PostAddIcon from "@mui/icons-material/PostAdd";
import FolderIcon from "@mui/icons-material/Folder";
import LabelIcon from "@mui/icons-material/Label";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const drawerWidth = 260;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

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

  // Breadcrumb oluşturma
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [
      {
        name: "Admin",
        path: "/admin",
        icon: <DashboardIcon sx={{ fontSize: 16 }} />,
      },
    ];

    // Dashboard sayfası (/admin veya /admin/dashboard)
    if (
      location.pathname === "/admin" ||
      location.pathname === "/admin/dashboard"
    ) {
      breadcrumbs.push({
        name: "Dashboard",
        path: "/admin",
        icon: <DashboardIcon sx={{ fontSize: 16 }} />,
      });
      return breadcrumbs;
    }

    // Diğer admin sayfaları
    if (pathnames.length > 1) {
      const pageMap = {
        posts: { name: "Yazılar", icon: <ArticleIcon sx={{ fontSize: 16 }} /> },
        categories: {
          name: "Kategoriler",
          icon: <CategoryIcon sx={{ fontSize: 16 }} />,
        },
        tags: { name: "Etiketler", icon: <TagIcon sx={{ fontSize: 16 }} /> },
        comments: {
          name: "Yorumlar",
          icon: <CommentIcon sx={{ fontSize: 16 }} />,
        },
        users: {
          name: "Kullanıcılar",
          icon: <PeopleIcon sx={{ fontSize: 16 }} />,
        },
        settings: {
          name: "Ayarlar",
          icon: <SettingsIcon sx={{ fontSize: 16 }} />,
        },
      };

      const currentPage = pathnames[1];
      if (pageMap[currentPage]) {
        breadcrumbs.push({
          name: pageMap[currentPage].name,
          path: `/admin/${currentPage}`,
          icon: pageMap[currentPage].icon,
        });

        // Yeni yazı oluştur sayfası için
        if (pathnames[2] === "new" && currentPage === "posts") {
          breadcrumbs.push({
            name: "Yeni Yazı Oluştur",
            path: `/admin/posts/new`,
            icon: <PostAddIcon sx={{ fontSize: 16 }} />,
          });
        }
        // Yazı düzenle sayfası için
        else if (
          pathnames[2] &&
          pathnames[2] !== "new" &&
          currentPage === "posts"
        ) {
          breadcrumbs.push({
            name: "Yazı Düzenle",
            path: location.pathname,
            icon: <EditIcon sx={{ fontSize: 16 }} />,
          });
        }
      }
    }

    return breadcrumbs;
  };

  // Hızlı eylemler
  const speedDialActions = [
    {
      icon: <PostAddIcon />,
      name: "Yeni Yazı",
      action: () => navigate("/admin/posts/new"),
    },
    {
      icon: <FolderIcon />,
      name: "Yeni Kategori",
      action: () => navigate("/admin/categories/new"), // Categories sayfasına değil, yeni kategori sayfasına
    },
    {
      icon: <LabelIcon />,
      name: "Yeni Etiket",
      action: () => navigate("/admin/tags/new"), // Tags sayfasına değil, yeni etiket sayfasına
    },
  ];

  // Rol kontrolü
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.error.light,
            0.1
          )}, ${alpha(theme.palette.error.main, 0.05)})`,
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(10px)",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" color="error" fontWeight={600}>
            Bu sayfaya erişim yetkiniz yok.
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileView = () => {
    navigate(`/profile/${user?.username}`);
    handleProfileMenuClose();
  };

  const handleProfileEdit = () => {
    navigate(`/profile/${user?.username}/edit`);
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    handleProfileMenuClose();
    window.location.href = "/";
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.15
          )}, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(
            theme.palette.primary.light,
            0.08
          )})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.5px",
            mb: 0.5,
          }}
        >
          MUI BLOG
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
          Admin Panel
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 1 }}>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));
            const isDisabled =
              user?.role === "editor" && item.path !== "/admin/posts";

            return (
              <ListItem disablePadding key={item.text} sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={isDisabled ? "div" : Link}
                  to={isDisabled ? undefined : item.path}
                  onClick={() => {
                    if (!isDisabled) {
                      setMobileOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={isDisabled}
                  sx={{
                    borderRadius: 3,
                    mx: 1,
                    px: 2,
                    py: 1.5,
                    position: "relative",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: isActive
                      ? `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.12
                        )}, ${alpha(theme.palette.secondary.main, 0.08)})`
                      : "transparent",
                    color: isActive
                      ? "primary.main"
                      : isDisabled
                      ? "text.disabled"
                      : "text.primary",
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    pointerEvents: isDisabled ? "none" : "auto",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: isActive ? "70%" : 0,
                      background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: "0 2px 2px 0",
                      transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    },
                    "&:hover": {
                      background: isDisabled
                        ? "transparent"
                        : isActive
                        ? `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.18
                          )}, ${alpha(theme.palette.secondary.main, 0.12)})`
                        : `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.08
                          )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                      transform: isDisabled ? "none" : "translateX(6px)",
                      boxShadow: isDisabled
                        ? "none"
                        : `0 6px 20px ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive
                        ? "primary.main"
                        : isDisabled
                        ? "text.disabled"
                        : "text.secondary",
                      transition: "all 0.3s ease",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 600,
                      fontSize: "0.9rem",
                    }}
                  />
                  {isActive && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 1, transform: "scale(1)" },
                          "50%": { opacity: 0.5, transform: "scale(1.2)" },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          component="a"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          variant="outlined"
          startIcon={<HomeIcon />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: "primary.main",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              transform: "translateY(-2px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Ana Sayfaya Dön
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: "100%",
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          },
          ml: {
            xs: 0,
            md: desktopOpen ? `${drawerWidth}px` : 0,
          },
          background: `linear-gradient(135deg, ${alpha("#fff", 0.95)}, ${alpha(
            "#f8fafc",
            0.9
          )}, ${alpha("#e3f2fd", 0.85)})`,
          backdropFilter: "blur(20px)",
          color: theme.palette.text.primary,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
        elevation={0}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
          {/* Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: "primary.main",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: "scale(1.05) rotate(5deg)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isMobile ? (
              mobileOpen ? (
                <MenuOpenIcon />
              ) : (
                <MenuIcon />
              )
            ) : desktopOpen ? (
              <MenuOpenIcon />
            ) : (
              <MenuIcon />
            )}
          </IconButton>

          {/* Breadcrumbs */}
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{
                "& .MuiBreadcrumbs-separator": {
                  color: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            >
              {getBreadcrumbs().map((breadcrumb, index) => (
                <Stack
                  key={breadcrumb.path}
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  component={
                    index === getBreadcrumbs().length - 1 ? "div" : Link
                  }
                  to={breadcrumb.path}
                  sx={{
                    textDecoration: "none",
                    color:
                      index === getBreadcrumbs().length - 1
                        ? "text.primary"
                        : alpha(theme.palette.text.primary, 0.7),
                    "&:hover": {
                      color: "primary.main",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  {breadcrumb.icon}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight:
                        index === getBreadcrumbs().length - 1 ? 600 : 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    {breadcrumb.name}
                  </Typography>
                </Stack>
              ))}
            </Breadcrumbs>
          </Box>

          {/* Yeni Yazı Butonu */}
          <Button
            variant="contained"
            startIcon={<PostAddIcon />}
            onClick={() => navigate("/admin/posts/new")}
            sx={{
              mr: 2,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              },
              transition: "all 0.2s ease",
            }}
          >
            Yeni Yazı
          </Button>

          {/* User Profile Section */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ position: "relative", width: 44, height: 44 }}>
              <Tooltip title="Profil Menüsü" arrow>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    p: 0,
                    width: 44,
                    height: 44,
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Avatar
                    src={user?.profileImage}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    {user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={700}
                lineHeight={1.2}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 180,
                }}
              >
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.75rem"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 180,
                  mt: 0.2,
                  display: "block",
                }}
              >
                @{user?.username}
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableAutoFocusItem
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            minWidth: 200,
            background: `linear-gradient(135deg, ${alpha(
              "#fff",
              0.95
            )}, ${alpha("#f8fafc", 0.9)})`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        <MenuItem
          onClick={handleProfileView}
          sx={{ py: 1.5, borderRadius: 2, mx: 1 }}
        >
          <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Profili Görüntüle
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleProfileEdit}
          sx={{ py: 1.5, borderRadius: 2, mx: 1 }}
        >
          <EditIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Profili Düzenle
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 1.5, borderRadius: 2, mx: 1, color: "error.main" }}
        >
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Çıkış Yap
          </Typography>
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: desktopOpen ? drawerWidth : 0 },
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
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
              background: `linear-gradient(180deg, ${alpha(
                "#fff",
                0.98
              )}, ${alpha("#f8fafc", 0.95)}, ${alpha("#e3f2fd", 0.9)})`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 8px 32px ${alpha(
                theme.palette.primary.main,
                0.15
              )}`,
              border: "none",
              transition: theme.transitions.create("transform", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open={desktopOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: desktopOpen ? drawerWidth : 0,
              background: `linear-gradient(180deg, ${alpha(
                "#fff",
                0.98
              )}, ${alpha("#f8fafc", 0.95)}, ${alpha("#e3f2fd", 0.9)})`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.primary.main,
                0.08
              )}`,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderLeft: "none",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              overflow: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          },
          bgcolor: "background.default",
          px: { xs: 2, md: 3 },
          pb: 5,
          pt: { xs: 1, md: 2 },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
