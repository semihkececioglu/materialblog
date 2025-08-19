import React from "react";
import {
  Drawer,
  Avatar,
  List,
  ListItemText,
  Collapse,
  Divider,
  Box,
  useTheme,
  ListItemButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const MobileDrawer = ({
  drawerOpen,
  setDrawerOpen,
  categories = [],
  drawerCatOpen,
  setDrawerCatOpen,
  drawerUserOpen,
  setDrawerUserOpen,
  user,
  handleCategoryClick,
  handleProfileNavigate,
  dispatch,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const bgColor = isDark
    ? "linear-gradient(135deg, rgba(30,30,30,0.9), rgba(50,50,50,0.7))"
    : "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.25))";

  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const dividerColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  // id’ler: aria-controls hedefleri
  const catPanelId = "drawer-categories-panel";
  const userPanelId = "drawer-user-panel";

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 260,
          background: bgColor,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          borderRadius: "0 12px 12px 0",
        },
        // Drawer’ın kendisine isim veriyoruz
        "aria-label": "Ana menü çekmecesi",
      }}
    >
      <MotionBox
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        sx={{ py: 1 }}
      >
        <List>
          {/* Ana Sayfa */}
          <ListItemButton
            component={Link}
            to="/"
            aria-label="Ana sayfaya git"
            onClick={() => {
              window.scrollTo(0, 0);
              setDrawerOpen(false);
            }}
            sx={{ "&:hover": { backgroundColor: hoverBg } }}
          >
            <ListItemText
              primary="Ana Sayfa"
              primaryTypographyProps={{
                color: "text.primary",
                fontWeight: 500,
              }}
            />
          </ListItemButton>

          {/* Kategoriler (açılır) */}
          <ListItemButton
            onClick={() => setDrawerCatOpen(!drawerCatOpen)}
            aria-label="Kategorileri aç"
            aria-expanded={drawerCatOpen ? "true" : "false"}
            aria-controls={catPanelId}
            sx={{ "&:hover": { backgroundColor: hoverBg } }}
          >
            <ListItemText primary="Kategoriler" />
            {drawerCatOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={drawerCatOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding id={catPanelId}>
              {categories.map((cat) => (
                <ListItemButton
                  key={cat}
                  sx={{
                    pl: 4,
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    "&:hover": { backgroundColor: hoverBg },
                  }}
                  aria-label={`Kategori: ${cat}`}
                  onClick={() => {
                    handleCategoryClick(cat);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={cat} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1, backgroundColor: dividerColor }} />

          {/* Kullanıcı Bölümü */}
          {!user ? (
            <>
              <ListItemButton
                component={Link}
                to="/login"
                aria-label="Giriş yap sayfasına git"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setDrawerOpen(false);
                }}
                sx={{ "&:hover": { backgroundColor: hoverBg } }}
              >
                <ListItemText primary="Giriş Yap" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/register"
                aria-label="Kayıt ol sayfasına git"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setDrawerOpen(false);
                }}
                sx={{ "&:hover": { backgroundColor: hoverBg } }}
              >
                <ListItemText primary="Kayıt Ol" />
              </ListItemButton>
            </>
          ) : (
            <>
              {/* Avatar + Kullanıcı Adı (açılır başlık) */}
              <ListItemButton
                onClick={() => setDrawerUserOpen(!drawerUserOpen)}
                aria-label="Kullanıcı menüsünü aç"
                aria-expanded={drawerUserOpen ? "true" : "false"}
                aria-controls={userPanelId}
                aria-haspopup="true"
                sx={{
                  "&:hover": { backgroundColor: hoverBg },
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={user.profileImage || ""}
                  alt={`${user.username} profil resmi`}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: user.profileImage ? "transparent" : "primary.main",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {!user.profileImage && user.username.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={user.username}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                />
                {drawerUserOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              {/* Kullanıcı menüsü */}
              <Collapse in={drawerUserOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding id={userPanelId}>
                  <ListItemButton
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      "&:hover": { backgroundColor: hoverBg },
                    }}
                    aria-label="Profili görüntüle"
                    onClick={() => {
                      handleProfileNavigate("");
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary="Profili Görüntüle" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      "&:hover": { backgroundColor: hoverBg },
                    }}
                    aria-label="Profili düzenle"
                    onClick={() => {
                      handleProfileNavigate("/edit");
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary="Profili Düzenle" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      "&:hover": { backgroundColor: hoverBg },
                    }}
                    aria-label="Çıkış yap"
                    onClick={() => {
                      dispatch({ type: "user/logout" });
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary="Çıkış Yap" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}
        </List>
      </MotionBox>
    </Drawer>
  );
};

export default MobileDrawer;
