import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  Paper,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const EditProfilePage = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || user.username !== username) return;

    // Kullanıcının mevcut bilgilerini backend'den çek
    axios
      .get(
        `https://materialblog-server-production.up.railway.app/api/users/${username}`
      )
      .then((res) => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
      })
      .catch((err) => {
        console.error("Kullanıcı bilgisi alınamadı:", err);
      });
  }, [user, username]);

  if (!user || user.username !== username) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Bu sayfayı düzenleme yetkiniz yok.</Typography>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://materialblog-server-production.up.railway.app/api/users/${username}`,
        { firstName, lastName }
      );
      setOpen(true);
      setTimeout(() => navigate(`/profile/${username}`), 1500);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
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
              bgcolor: stringToColor(user.username),
              color: "white",
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography>
            {user.firstName} {user.lastName}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ad"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Soyad"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            Kaydet
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message="Profil başarıyla güncellendi"
      />
    </Box>
  );
};

export default EditProfilePage;
