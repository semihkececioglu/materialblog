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
} from "@mui/material";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usernameOrEmail || !password) {
      setError("Tüm alanları doldurmanız gerekiyor.");
      return;
    }

    try {
      const res = await axios.post(
        "https://materialblog-server-production.up.railway.app/api/auth/login",
        { usernameOrEmail, password }
      );

      const { user, token } = res.data;

      dispatch(login({ user, token }));

      // Snackbar'ı göster ve yönlendir
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/");
        window.scrollTo(0, 0);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Giriş işlemi sırasında bir hata oluştu."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.7)"
              : "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 600 }}>
          Giriş Yap
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Kullanıcı Adı veya E-posta"
            fullWidth
            sx={{ mb: 2 }}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.3,
              textTransform: "none",
              fontWeight: 500,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(to right, #111, #333)"
                  : "linear-gradient(to right, #000, #222)",
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(to right, #222, #444)"
                    : "linear-gradient(to right, #111, #333)",
              },
            }}
          >
            Giriş Yap
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Hesabınız yok mu?{" "}
            <Link to="/register" style={{ textDecoration: "underline" }}>
              Kayıt Ol
            </Link>
          </Typography>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            fontWeight: 500,
          }}
        >
          Hoş geldin, {usernameOrEmail.split("@")[0]}!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
