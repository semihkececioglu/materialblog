import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Snackbar,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon, Brightness4 } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";

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
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileAnchorEl(null);
    setLoadingLogout(true);

    setTimeout(() => {
      dispatch(logout());
      setSnackbarOpen(true);
      setLoadingLogout(false);
      navigate("/");
      window.scrollTo(0, 0);
    }, 1000);
  };

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

      {/* 🔍 Arama butonu */}
      <Tooltip title="Ara">
        <IconButton
          aria-label="Ara"
          color="inherit"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>

      {/* 🌙 Tema butonu */}
      <Tooltip title="Tema Değiştir">
        <IconButton
          aria-label="Tema değiştir"
          color="inherit"
          onClick={toggleTheme}
        >
          <Brightness4 />
        </IconButton>
      </Tooltip>

      {user && (
        <>
          {/* 👤 Profil butonu */}
          <Tooltip title="Profil Menüsü">
            <IconButton
              aria-label="Profil menüsünü aç"
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
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
          </Tooltip>

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
            <MenuItem onClick={handleLogout} disabled={loadingLogout}>
              {loadingLogout ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : (
                "Çıkış Yap"
              )}
            </MenuItem>
          </Menu>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            fontWeight: 500,
          }}
        >
          Başarıyla çıkış yaptınız.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RightMenu;
