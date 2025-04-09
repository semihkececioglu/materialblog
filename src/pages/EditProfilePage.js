// EditProfilePage.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const EditProfilePage = () => {
  const { user, login } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [name, setName] = useState(user?.name || "");

  if (!user || user.name !== username) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Bu sayfayı düzenleme yetkiniz yok.</Typography>
      </Box>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, user?.isAdmin);
      navigate(`/profile/${name}`);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 500,
          mx: "auto",
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Profili Düzenle
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: stringToColor(name),
              color: "white",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography>{name}</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            Kaydet
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProfilePage;
