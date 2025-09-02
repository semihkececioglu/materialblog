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
  Skeleton,
  Card,
  Fade,
  LinearProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// CLOUDINARY IMAGE UPLOAD FUNCTION
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
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const containerRef = useRef(null);

  // Değişiklikleri takip et
  useEffect(() => {
    if (!isLoading && user) {
      const hasAnyChanges =
        firstName !== user.firstName ||
        lastName !== user.lastName ||
        bio !== (user.bio || "") ||
        profileImage !== (user.profileImage || "");
      setHasChanges(hasAnyChanges);
    }
  }, [firstName, lastName, bio, profileImage, user, isLoading]);

  useEffect(() => {
    if (!user || user.username !== username) return;

    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, username]);

  if (!user || user.username !== username) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 400, mx: "auto" }}>
          Bu sayfayı düzenleme yetkiniz yok.
        </Alert>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `https://materialblog-server-production.up.railway.app/api/users/${username}`,
        { firstName, lastName, bio, profileImage }
      );
      setSuccess(true);
      setHasChanges(false);
      setTimeout(() => {
        navigate(`/profile/${username}`);
      }, 2000);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
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
  };

  return (
    <Box sx={{ p: 4, mt: { xs: 1, md: 2 }, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Profili Düzenle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Profil bilgilerinizi güncelleyin
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
                : "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          {/* Progress Bar */}
          {(uploading || saving) && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 4,
                left: 0,
                right: 0,
                borderRadius: 0,
              }}
            />
          )}

          {/* Avatar Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  variant="circular"
                  width={100}
                  height={100}
                  sx={{ mb: 2 }}
                />
                <Skeleton variant="rounded" width={120} height={32} />
              </Box>
            ) : (
              <Fade in={!isLoading}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      src={profileImage || ""}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: profileImage
                          ? "transparent"
                          : stringToColor(user.username),
                        color: "white",
                        fontWeight: 700,
                        fontSize: "2.5rem",
                        boxShadow: theme.shadows[8],
                        border: "4px solid",
                        borderColor: "background.paper",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {!profileImage && user.username.charAt(0).toUpperCase()}
                    </Avatar>

                    {/* Upload Button */}
                    <IconButton
                      component="label"
                      disabled={uploading}
                      sx={{
                        position: "absolute",
                        bottom: -8,
                        right: -8,
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        width: 40,
                        height: 40,
                        boxShadow: theme.shadows[4],
                        "&:hover": {
                          bgcolor: theme.palette.primary.dark,
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {uploading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <PhotoCameraIcon fontSize="small" />
                      )}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                      />
                    </IconButton>
                  </Box>

                  <Chip
                    icon={<PersonIcon sx={{ fontSize: 18 }} />}
                    label={`@${user.username}`}
                    variant="filled"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      px: 2,
                      py: 0.5,
                      height: 36,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: "white",
                      borderRadius: 3,
                      boxShadow: theme.shadows[3],
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: theme.shadows[6],
                      },
                      "& .MuiChip-icon": {
                        color: "white",
                        fontSize: 18,
                      },
                    }}
                  />
                </Box>
              </Fade>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Form */}
          {isLoading ? (
            <Box>
              <Skeleton height={80} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton height={80} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton height={140} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton height={60} sx={{ borderRadius: 2 }} />
            </Box>
          ) : (
            <Fade in={!isLoading}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Ad"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-1px)",
                          boxShadow: theme.shadows[4],
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Soyad"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-1px)",
                          boxShadow: theme.shadows[4],
                        },
                      },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Biyografi"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setBio(e.target.value);
                    }
                  }}
                  helperText={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <InfoIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {bio.length}/300 karakter
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                      "&.Mui-focused": {
                        transform: "translateY(-1px)",
                        boxShadow: theme.shadows[4],
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={saving || !hasChanges}
                  startIcon={
                    saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : success ? (
                      <CheckCircleIcon />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    background: success
                      ? `linear-gradient(45deg, #4caf50, #66bb6a)`
                      : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[8],
                    },
                    "&:disabled": {
                      background: theme.palette.action.disabled,
                      color: theme.palette.action.disabled,
                    },
                  }}
                >
                  {saving
                    ? "Kaydediliyor..."
                    : success
                    ? "Başarıyla Kaydedildi!"
                    : hasChanges
                    ? "Kaydet"
                    : "Kaydet"}
                </Button>

                {hasChanges && (
                  <Fade in={hasChanges}>
                    <Alert
                      severity="info"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(33, 150, 243, 0.1)"
                            : "rgba(33, 150, 243, 0.05)",
                      }}
                    >
                      Kaydedilmemiş değişiklikleriniz var
                    </Alert>
                  </Fade>
                )}
              </form>
            </Fade>
          )}
        </Card>

        {/* Success Snackbar */}
        <Snackbar
          open={success}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            Profil başarıyla güncellendi! Yönlendiriliyorsunuz...
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default EditProfilePage;
