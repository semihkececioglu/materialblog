import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Tüm alanları doldurmanız gerekiyor.");
      return;
    }

    try {
      const res = await axios.post(
        "https://materialblog-server-production.up.railway.app/api/auth/login",
        {
          usernameOrEmail: username,
          password,
        }
      );

      const { token, user } = res.data;
      login(user, token);
      navigate("/");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(
        err.response?.data?.message || "Giriş sırasında bir hata oluştu."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "rgba(30,30,30,0.7)"
              : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
          Giriş Yap
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Kullanıcı Adı"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
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
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Hesabınız yok mu?{" "}
          <Link to="/register" style={{ textDecoration: "underline" }}>
            Kayıt Ol
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
