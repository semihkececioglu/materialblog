import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";

const categories = ["React", "Tasarım", "Javascript"];

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
  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <List sx={{ width: 250 }}>
        {/* Ana Sayfa */}
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

        {/* Kategoriler */}
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
            <ListItem button onClick={() => setDrawerUserOpen(!drawerUserOpen)}>
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
    </Drawer>
  );
};

export default MobileDrawer;
