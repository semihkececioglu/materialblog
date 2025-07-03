import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Box,
  useTheme,
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
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => {
              window.scrollTo(0, 0);
              setDrawerOpen(false);
            }}
            sx={{
              "&:hover": { backgroundColor: hoverBg },
            }}
          >
            <ListItemText
              primary="Ana Sayfa"
              primaryTypographyProps={{
                color: "text.primary",
                fontWeight: 500,
              }}
            />
          </ListItem>

          {/* Kategoriler */}
          <ListItem
            button
            onClick={() => setDrawerCatOpen(!drawerCatOpen)}
            sx={{ "&:hover": { backgroundColor: hoverBg } }}
          >
            <ListItemText primary="Kategoriler" />
            {drawerCatOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={drawerCatOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories.map((cat) => (
                <ListItem
                  key={cat}
                  button
                  sx={{
                    pl: 4,
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    "&:hover": {
                      backgroundColor: hoverBg,
                    },
                  }}
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

          <Divider sx={{ my: 1, backgroundColor: dividerColor }} />

          {/* Kullanıcı Bölümü */}
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
                sx={{ "&:hover": { backgroundColor: hoverBg } }}
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
                sx={{ "&:hover": { backgroundColor: hoverBg } }}
              >
                <ListItemText primary="Kayıt Ol" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => setDrawerUserOpen(!drawerUserOpen)}
                sx={{ "&:hover": { backgroundColor: hoverBg } }}
              >
                <ListItemText primary="Hesabım" />
                {drawerUserOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={drawerUserOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: hoverBg,
                      },
                    }}
                    onClick={() => handleProfileNavigate("")}
                  >
                    <ListItemText primary="Profili Görüntüle" />
                  </ListItem>
                  <ListItem
                    button
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: hoverBg,
                      },
                    }}
                    onClick={() => handleProfileNavigate("/edit")}
                  >
                    <ListItemText primary="Profili Düzenle" />
                  </ListItem>
                  <ListItem
                    button
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: hoverBg,
                      },
                    }}
                    onClick={() => {
                      dispatch({ type: "user/logout" });
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
      </MotionBox>
    </Drawer>
  );
};

export default MobileDrawer;
