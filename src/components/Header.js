// Header.js
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
  Avatar,
} from "@mui/material";
import {
  Brightness4,
  ExpandMore,
  Search,
  ArrowDropDown,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const categories = ["React", "Tasarım", "Javascript"];

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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategorySelect = (category) => {
    navigate(`/category/${slugify(category)}`);
    setAnchorEl(null);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
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
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{ flexWrap: "wrap", gap: 2, justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Material UI Blog
            </Link>
          </Typography>

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
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                },
                "&.Mui-focused": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                },
                "& input::placeholder": {
                  color: "#ffffffaa",
                },
              },
            }}
            sx={{ width: 240 }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            color="inherit"
            endIcon={<ExpandMore />}
            onClick={handleMenuClick}
          >
            Kategoriler
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {categories.map((category) => (
              <MenuItem
                key={category}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </MenuItem>
            ))}
          </Menu>

          <Button color="inherit" component={Link} to="/">
            Ana Sayfa
          </Button>

          {user ? (
            <Box>
              <IconButton onClick={(e) => setProfileAnchorEl(e.currentTarget)}>
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
                  ÇIKIŞ YAP
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
