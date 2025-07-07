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
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import axios from "axios";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !username || !email || !password) {
      setError("Tüm alanları doldurmanız gerekiyor.");
      return;
    }

    try {
      const res = await axios.post(
        "https://materialblog-server-production.up.railway.app/api/auth/register",
        {
          username,
          email,
          password,
          firstName,
          lastName,
        }
      );

      // Gelen token ve kullanıcı bilgisi
      const { user, token } = res.data;

      // Redux store'a ve localStorage'a birlikte yazılır
      dispatch(login({ user, token }));

      // Giriş yapılmış şekilde ana sayfaya yönlendir
      navigate("/");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(
        err.response?.data?.message || "Kayıt işlemi sırasında bir hata oluştu."
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
          Kayıt Ol
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Ad"
            fullWidth
            sx={{ mb: 2 }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Soyad"
            fullWidth
            sx={{ mb: 2 }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Kullanıcı Adı"
            fullWidth
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="E-Posta"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Kayıt Ol
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Zaten bir hesabınız var mı?{" "}
            <Link to="/login" style={{ textDecoration: "underline" }}>
              Giriş Yap
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
