import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

const AdminSettingsPage = () => {
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("siteSettings")) || {};
    setSiteTitle(settings.title || "");
    setSiteDescription(settings.description || "");
    setDarkMode(settings.darkMode || false);
  }, []);

  const handleSave = () => {
    const newSettings = {
      title: siteTitle,
      description: siteDescription,
      darkMode,
    };
    localStorage.setItem("siteSettings", JSON.stringify(newSettings));
    setSnackbar({ open: true, message: "Ayarlar kaydedildi" });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Ayarlar
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, maxWidth: 600 }}>
        <TextField
          fullWidth
          label="Site Başlığı"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Site Açıklaması"
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
            />
          }
          label="Karanlık Mod Aktif"
        />

        <Divider sx={{ my: 2 }} />

        <Button variant="contained" onClick={handleSave}>
          Kaydet
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettingsPage;
