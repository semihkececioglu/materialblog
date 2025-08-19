import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import { Menu as MenuIcon, ArrowDropDown } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { slugify } from "../../utils";

const categories = ["React", "Tasarım", "Javascript"];

const LeftMenu = ({
  isMobile,
  setAnchorEl,
  anchorEl,
  handleCategoryClick,
  setDrawerOpen,
}) => {
  const menuButtonId = "categories-menu-button";
  const menuId = "categories-menu";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          color="inherit"
          edge="start"
          aria-label="Menüyü aç"
        >
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
          color: "inherit",
          fontWeight: 600,
          fontFamily: "inherit",
        }}
        aria-label="Material Blog ana sayfa"
      >
        Material Blog
      </Typography>

      {!isMobile && (
        <>
          <Button
            component={Link}
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            sx={{ color: "inherit", textTransform: "none" }}
            aria-label="Ana sayfaya git"
          >
            Ana Sayfa
          </Button>

          <Button
            id={menuButtonId}
            endIcon={<ArrowDropDown />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: "inherit", textTransform: "none" }}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            aria-controls={Boolean(anchorEl) ? menuId : undefined}
          >
            Kategoriler
          </Button>

          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            TransitionComponent={Fade}
            MenuListProps={{ "aria-labelledby": menuButtonId, role: "menu" }}
          >
            {categories.map((cat) => (
              <MenuItem
                key={cat}
                onClick={() => {
                  handleCategoryClick(cat);
                  setAnchorEl(null);
                }}
                sx={{ fontSize: 14 }}
                role="menuitem"
              >
                {cat}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default LeftMenu;
