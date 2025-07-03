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
  return (
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
          color: "inherit",
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
              color: "inherit",
              textTransform: "none",
            }}
          >
            Ana Sayfa
          </Button>

          <Button
            endIcon={<ArrowDropDown />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: "inherit",
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
  );
};

export default LeftMenu;
