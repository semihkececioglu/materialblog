import { slugify } from "../utils";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
  Box,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Avatar,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  Divider,
  Slide,
  Fade,
  Grow,
} from "@mui/material";
import {
  Brightness4,
  ExpandMore,
  Search,
  ArrowDropDown,
  Menu as MenuIcon,
  Close as CloseIcon,
  Code as CodeIcon,
  DesignServices as DesignIcon,
  Javascript as JsIcon,
  Send as SendIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const categories = [
  { name: "React", icon: <CodeIcon fontSize="small" /> },
  { name: "Tasarım", icon: <DesignIcon fontSize="small" /> },
  { name: "Javascript", icon: <JsIcon fontSize="small" /> },
];

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 50%)`;
  return color;
};

function Header({ toggleTheme, searchTerm, setSearchTerm }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategorySelect = (category) => {
    navigate(`/category/${slugify(category)}`);
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleProfileNavigate = (path) => {
    navigate(`/profile/${user.name}${path}`);
    setProfileAnchorEl(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position={isMobile ? "sticky" : "static"}>
        <Toolbar
          sx={{ flexWrap: "wrap", gap: 2, justifyContent: "space-between" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {isMobile && (
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6">
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                Material UI Blog
              </Link>
            </Typography>

            {!isMobile && (
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#ffffffcc" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 2,
                    color: "#fff",
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)" },
                    "&.Mui-focused": {
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                    "& input::placeholder": { color: "#ffffffaa" },
                  },
                }}
                sx={{ width: 240, display: { xs: "none", sm: "block" } }}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              ml: "auto",
            }}
          >
            {isMobile && (
              <>
                <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                  <Search />
                </IconButton>
                <IconButton color="inherit" onClick={toggleTheme}>
                  <Brightness4 />
                </IconButton>
              </>
            )}

            {!isMobile && (
              <>
                <IconButton color="inherit" component={Link} to="/">
                  <HomeIcon />
                </IconButton>

                <Fade in={true} timeout={400}>
                  <Button
                    color="inherit"
                    endIcon={<ExpandMore />}
                    onClick={handleMenuClick}
                  >
                    Kategoriler
                  </Button>
                </Fade>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  TransitionComponent={Grow}
                >
                  {categories.map((cat) => (
                    <MenuItem
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {cat.icon} {cat.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>

                {user ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: stringToColor(user.name),
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <ArrowDropDown sx={{ color: "white" }} />
                    </IconButton>
                    <Menu
                      anchorEl={profileAnchorEl}
                      open={Boolean(profileAnchorEl)}
                      onClose={() => setProfileAnchorEl(null)}
                    >
                      <MenuItem onClick={() => handleProfileNavigate("")}>
                        Profili Görüntüle
                      </MenuItem>
                      <MenuItem onClick={() => handleProfileNavigate("/edit")}>
                        Profili Düzenle
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          logout();
                          setProfileAnchorEl(null);
                        }}
                      >
                        Çıkış Yap
                      </MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      component={Link}
                      to="/login"
                      color="inherit"
                      variant="outlined"
                      size="small"
                    >
                      Giriş Yap
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      color="inherit"
                      variant="outlined"
                      size="small"
                    >
                      Kayıt Ol
                    </Button>
                  </Box>
                )}
                <IconButton color="inherit" onClick={toggleTheme}>
                  <Brightness4 />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Ana Sayfa" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Kategoriler" />
            </ListItem>
            {categories.map((cat) => (
              <ListItem
                button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {cat.icon}
                  <ListItemText primary={cat.name} />
                </Box>
              </ListItem>
            ))}
            <Divider />
            {user ? (
              <>
                <ListItem button onClick={() => handleProfileNavigate("")}>
                  Profili Görüntüle
                </ListItem>
                <ListItem button onClick={() => handleProfileNavigate("/edit")}>
                  Profili Düzenle
                </ListItem>
                <ListItem button onClick={logout}>
                  Çıkış Yap
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  Giriş Yap
                </ListItem>
                <ListItem button component={Link} to="/register">
                  Kayıt Ol
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </SwipeableDrawer>

      <Dialog
        fullScreen
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        TransitionComponent={Slide}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            bgcolor: "background.default",
          }}
        >
          <IconButton onClick={() => setSearchOpen(false)}>
            <CloseIcon />
          </IconButton>
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mx: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}

export default Header;
