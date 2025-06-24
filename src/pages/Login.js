import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

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

      // AuthContext'e login bilgisini gönder
      login(user, token);

      navigate("/");
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Giriş sırasında bir hata oluştu.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
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
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth>
            Giriş Yap
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
