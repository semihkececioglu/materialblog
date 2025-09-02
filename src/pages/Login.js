import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  Divider,
  Fade,
  Slide,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  LoginOutlined,
  WavingHand,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import axios from "axios";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!usernameOrEmail || !password) {
      setError("Tüm alanları doldurmanız gerekiyor.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://materialblog-server-production.up.railway.app/api/auth/login",
        { usernameOrEmail, password }
      );

      const { user, token } = res.data;

      dispatch(login({ user, token }));

      // ✅ Meta Pixel Event (Login)
      if (window.fbq) {
        window.fbq("trackCustom", "Login", {
          userId: user._id,
          username: user.username,
        });
      }

      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/");
        window.scrollTo(0, 0);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Giriş işlemi sırasında bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        px: 2,
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse at top, #1a1a1a 0%, #0d0d0d 50%, #000000 100%)"
            : "radial-gradient(ellipse at top, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === "dark"
              ? 'url(\'data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.02"><circle cx="30" cy="30" r="2"/></g></g></svg>\')'
              : 'url(\'data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23000000" fill-opacity="0.02"><circle cx="30" cy="30" r="2"/></g></g></svg>\')',
          animation: "float 20s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }}
    >
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
          opacity: 0.1,
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #10b981, #3b82f6)",
          opacity: 0.1,
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 6,
            background:
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.9)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)",
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)"
            }`,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
              }}
            >
              <WavingHand sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                fontSize: { xs: "1.75rem", sm: "2rem" },
              }}
            >
              Hoş Geldin!
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              Hesabına giriş yap ve keşfetmeye başla
            </Typography>
          </Box>

          {error && (
            <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  fontSize: "0.875rem",
                  "& .MuiAlert-icon": {
                    fontSize: 20,
                  },
                }}
              >
                {error}
              </Alert>
            </Slide>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Kullanıcı Adı veya E-posta"
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.2)",
                  },
                },
              }}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Şifre"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.2)",
                  },
                },
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? null : <LoginOutlined />}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            <Divider sx={{ my: 2, opacity: 0.6 }}>veya</Divider>

            <Typography variant="body2" align="center">
              Henüz hesabın yok mu?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                }}
              >
                Hemen kayıt ol
              </Link>
            </Typography>
          </form>
        </Paper>
      </Fade>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          icon={<WavingHand />}
          sx={{
            backdropFilter: "blur(16px)",
            backgroundColor: "rgba(16, 185, 129, 0.9)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
            fontWeight: 600,
            fontSize: 16,
            "& .MuiAlert-icon": {
              color: "white",
              fontSize: 24,
            },
          }}
        >
          Hoş geldin, {usernameOrEmail.split("@")[0]}!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
