import React from "react";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import { Search as SearchIcon, Brightness4 } from "@mui/icons-material";
import { Link } from "react-router-dom";

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

const RightMenu = ({
  isMobile,
  toggleTheme,
  searchOpen,
  setSearchOpen,
  user,
  profileAnchorEl,
  setProfileAnchorEl,
  handleProfileNavigate,
  dispatch,
}) => {
  return (
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
          <IconButton onClick={(e) => setProfileAnchorEl(e.currentTarget)}>
            <Avatar
              src={user.profileImage || ""}
              sx={{
                width: 32,
                height: 32,
                bgcolor: user.profileImage
                  ? "transparent"
                  : stringToColor(user.username),
                fontSize: "0.875rem",
                color: "white",
                fontWeight: 600,
              }}
            >
              {!user.profileImage && user.username.charAt(0).toUpperCase()}
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
                dispatch({ type: "user/logout" }); // dispatch(logout()) yerine type ile kullanıldıysa slice'tan ayarlanabilir
                setProfileAnchorEl(null);
              }}
            >
              Çıkış Yap
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default RightMenu;
