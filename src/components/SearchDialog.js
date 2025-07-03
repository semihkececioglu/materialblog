import React, { useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchTerm } from "../redux/searchSlice";

const SearchDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      dispatch(setSearchTerm(""));
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      PaperProps={{
        sx: {
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "5%", // ekranın üstünden %5 boşluk
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(30,30,30,0.95)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          p: 3,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          boxShadow: 6,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "#000" }} />
        </IconButton>
        <TextField
          autoFocus
          fullWidth
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          onKeyDown={handleKeyDown}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SendIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
              </InputAdornment>
            ),
            disableUnderline: true,
            sx: { color: theme.palette.text.primary },
          }}
        />
      </Box>
    </Dialog>
  );
};

export default SearchDialog;
