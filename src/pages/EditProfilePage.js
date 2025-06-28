import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
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

  const containerRef = useRef(null); // Snackbar'ın bağlanacağı alan

  useEffect(() => {
    if (!user || user.username !== username) return;

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
      setTimeout(() => {
        setOpen(false);
        navigate(`/profile/${username}`);
      }, 1500);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  return (
    <Box sx={{ p: 4, mt: { xs: 1, md: 2 } }}>
      <Box
        ref={containerRef}
        sx={{
          p: 4,
          maxWidth: 500,
          mx: "auto",
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.6)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: 10,
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
          Profili Düzenle
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: stringToColor(user.username),
              color: "white",
              fontWeight: 600,
              fontSize: 28,
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" color="text.secondary">
            @{user.username}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ad"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Soyad"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              fontWeight: 600,
              py: 1,
              borderRadius: 2,
            }}
          >
            Kaydet
          </Button>
        </form>
      </Box>

      {/* Snackbar Card'ın altına ortalı şekilde */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Snackbar
          open={open}
          autoHideDuration={3000}
          message="Profil başarıyla güncellendi"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          ContentProps={{
            sx: {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.04)",
              color: theme.palette.text.primary,
              backdropFilter: "blur(6px)",
              borderRadius: 2,
              px: 3,
              py: 1.5,
              boxShadow: 3,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center",
            },
          }}
          container={containerRef.current}
        />
      </Box>
    </Box>
  );
};

export default EditProfilePage;
