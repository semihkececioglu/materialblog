import React, { useState } from "react";
import { AppBar, Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import LeftMenu from "../header/LeftMenu";
import RightMenu from "../header/RightMenu";
import MobileDrawer from "../header/MobileDrawer";
import SearchDialog from "../SearchDialog";
import slugify from "../../utils/slugify";

const categories = ["React", "Tasarım", "Javascript"];

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
            sx={{ px: 2, display: "flex", justifyContent: "space-between" }}
          >
            <LeftMenu
              isMobile={isMobile}
              setAnchorEl={setAnchorEl}
              anchorEl={anchorEl}
              handleCategoryClick={handleCategoryClick}
              setDrawerOpen={setDrawerOpen}
            />

            <RightMenu
              isMobile={isMobile}
              toggleTheme={toggleTheme}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              user={user}
              profileAnchorEl={profileAnchorEl}
              setProfileAnchorEl={setProfileAnchorEl}
              handleProfileNavigate={handleProfileNavigate}
              dispatch={dispatch}
            />
          </Toolbar>
        </AppBar>
      </Box>

      <MobileDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        categories={categories}
        drawerCatOpen={drawerCatOpen}
        setDrawerCatOpen={setDrawerCatOpen}
        drawerUserOpen={drawerUserOpen}
        setDrawerUserOpen={setDrawerUserOpen}
        user={user}
        handleCategoryClick={handleCategoryClick}
        handleProfileNavigate={handleProfileNavigate}
        dispatch={dispatch}
      />

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
