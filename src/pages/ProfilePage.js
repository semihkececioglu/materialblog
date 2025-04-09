// ProfilePage.js
import React from "react";
import { Box, Typography, Avatar, useTheme, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const theme = useTheme();

  if (!user || user.name !== username) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Bu sayfayı görüntüleme yetkiniz yok.</Typography>
      </Box>
    );
  }

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: stringToColor(user.name),
              color: "white",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Kullanıcı Profili
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Beğenilen Yazılar (yakında)
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Kaydedilen Yazılar (yakında)
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
