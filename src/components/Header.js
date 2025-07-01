import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Fade,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ArrowDropDown,
  Brightness4,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { slugify } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import SearchDialog from "./SearchDialog";

const categories = ["React", "Tasarım", "Javascript"];

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return color;
};

const Header = ({ toggleTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerCatOpen, setDrawerCatOpen] = useState(false);
  const [drawerUserOpen, setDrawerUserOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${slugify(category)}`);
    window.scrollTo(0, 0);
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleProfileNavigate = (path) => {
    navigate(`/profile/${user.username}${path}`);
    window.scrollTo(0, 0);
    setProfileAnchorEl(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          top: 16,
          zIndex: 1100,
          px: 2,
        }}
      >
        <AppBar
          position="static"
          sx={{
            width: "100%",
            maxWidth: "1152px",
            borderRadius: "16px",
            background:
              theme.palette.mode === "dark"
                ? "rgba(30,30,30,0.6)"
                : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.6)"
                : "0 8px 32px rgba(0,0,0,0.1)",
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar
            disableGutters
            sx={{ px: 2, display: "flex", justifyContent: "space-between" }}
          >
            {/* SOL TARAF */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                variant="h6"
                component={Link}
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                sx={{
                  textDecoration: "none",
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                Material Blog
              </Typography>
              {!isMobile && (
                <>
                  <Button
                    component={Link}
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    sx={{
                      color: theme.palette.text.primary,
                      textTransform: "none",
                    }}
                  >
                    Ana Sayfa
                  </Button>
                  <Button
                    endIcon={<ArrowDropDown />}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                      color: theme.palette.text.primary,
                      textTransform: "none",
                    }}
                  >
                    Kategoriler
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    TransitionComponent={Fade}
                  >
                    {categories.map((cat) => (
                      <MenuItem
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        sx={{ fontSize: 14 }}
                      >
                        {cat}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>

            {/* SAĞ TARAF */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!user && !isMobile && (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    onClick={() => window.scrollTo(0, 0)}
                    sx={{ textTransform: "none" }}
                  >
                    Giriş Yap
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    onClick={() => window.scrollTo(0, 0)}
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Kayıt Ol
                  </Button>
                </>
              )}

              <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>

              <IconButton color="inherit" onClick={toggleTheme}>
                <Brightness4 />
              </IconButton>

              {user && (
                <>
                  <IconButton
                    onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: stringToColor(user.username),
                        fontSize: "0.875rem",
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={() => setProfileAnchorEl(null)}
                    TransitionComponent={Fade}
                  >
                    <MenuItem onClick={() => handleProfileNavigate("")}>
                      Profili Görüntüle
                    </MenuItem>
                    <MenuItem onClick={() => handleProfileNavigate("/edit")}>
                      Profili Düzenle
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        dispatch(logout());
                        setProfileAnchorEl(null);
                      }}
                    >
                      Çıkış Yap
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* MOBİL DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => {
              window.scrollTo(0, 0);
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Ana Sayfa" />
          </ListItem>

          <ListItem button onClick={() => setDrawerCatOpen(!drawerCatOpen)}>
            <ListItemText primary="Kategoriler" />
            {drawerCatOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={drawerCatOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories.map((cat) => (
                <ListItem
                  key={cat}
                  button
                  sx={{ pl: 4 }}
                  onClick={() => {
                    handleCategoryClick(cat);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={cat} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {!user ? (
            <>
              <ListItem
                button
                component={Link}
                to="/login"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary="Giriş Yap" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/register"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary="Kayıt Ol" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => setDrawerUserOpen(!drawerUserOpen)}
              >
                <ListItemText primary="Hesabım" />
                {drawerUserOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={drawerUserOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    sx={{ pl: 4 }}
                    onClick={() => handleProfileNavigate("")}
                  >
                    <ListItemText primary="Profili Görüntüle" />
                  </ListItem>
                  <ListItem
                    button
                    sx={{ pl: 4 }}
                    onClick={() => handleProfileNavigate("/edit")}
                  >
                    <ListItemText primary="Profili Düzenle" />
                  </ListItem>
                  <ListItem
                    button
                    sx={{ pl: 4 }}
                    onClick={() => {
                      dispatch(logout());
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary="Çıkış Yap" />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Drawer>

      {/* Arama dialog bileşeni */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
