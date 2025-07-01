import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  Snackbar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// 🔧 Cloudinary görsel yükleme fonksiyonu
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "materialblog");
  formData.append("cloud_name", "da2mjic2e");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/da2mjic2e/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const EditProfilePage = () => {
  const user = useSelector((state) => state.user.currentUser);
  const { username } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!user || user.username !== username) return;

    axios
      .get(
        `https://materialblog-server-production.up.railway.app/api/users/${username}`
      )
      .then((res) => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setBio(res.data.bio || "");
        setProfileImage(res.data.profileImage || "");
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
        { firstName, lastName, bio, profileImage }
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

        {/* Avatar ve düzenleme ikonu */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mb: 3,
            position: "relative",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={profileImage || ""}
              sx={{
                width: 72,
                height: 72,
                bgcolor: profileImage
                  ? "transparent"
                  : stringToColor(user.username),
                color: "white",
                fontWeight: 600,
                fontSize: 28,
              }}
            >
              {!profileImage && user.username.charAt(0).toUpperCase()}
            </Avatar>

            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                bgcolor: "background.paper",
                borderRadius: "50%",
                boxShadow: 2,
              }}
            >
              <IconButton
                component="label"
                size="small"
                disabled={uploading}
                sx={{ p: 0.5 }}
              >
                <EditIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const imageUrl = await uploadImageToCloudinary(file);
                      setProfileImage(imageUrl);
                    } catch (err) {
                      console.error("Yükleme hatası:", err);
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="subtitle1" color="text.secondary">
            @{user.username}
          </Typography>
          {uploading && <CircularProgress size={20} sx={{ mt: 1 }} />}
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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Biyografi (max 300 karakter)"
            variant="outlined"
            multiline
            rows={4}
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= 300) {
                setBio(e.target.value);
              }
            }}
            helperText={`${bio.length}/300`}
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
