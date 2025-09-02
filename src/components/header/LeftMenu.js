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
          fontWeight: 700,
          fontFamily: "'Inter', 'Roboto', sans-serif",
          fontSize: { xs: "1.2rem", md: "1.4rem" },
          letterSpacing: "-0.5px",
          position: "relative",
          "&:hover": {
            color: "primary.main",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
          "&::after": {
            content: '""',
            position: "absolute",
            width: "0%",
            height: "2px",
            bottom: "-2px",
            left: "50%",
            backgroundColor: "primary.main",
            transition: "all 0.3s ease-in-out",
            transform: "translateX(-50%)",
          },
          "&:hover::after": {
            width: "100%",
          },
        }}
        aria-label="MUI Blog ana sayfa"
      >
        <Box
          component="span"
          sx={{
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          }}
        >
          MUI
        </Box>
        <Box
          component="span"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            ml: 0.5,
          }}
        >
          BLOG
        </Box>
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
            component={Link}
            to="/about"
            onClick={() => window.scrollTo(0, 0)}
            sx={{ color: "inherit", textTransform: "none" }}
            aria-label="Hakkımızda sayfasına git"
          >
            Hakkımızda
          </Button>

          <Button
            component={Link}
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            sx={{ color: "inherit", textTransform: "none" }}
            aria-label="İletişim sayfasına git"
          >
            İletişim
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
            disableScrollLock={true}
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
