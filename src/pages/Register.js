import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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

      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Kayıt işlemi sırasında bir hata oluştu.");
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
          <Button type="submit" variant="contained" fullWidth>
            Kayıt Ol
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
