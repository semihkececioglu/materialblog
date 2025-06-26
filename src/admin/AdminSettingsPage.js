import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const AdminSettingsPage = () => {
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    axios
      .get("https://materialblog-server-production.up.railway.app/api/settings")
      .then((res) => {
        const settings = res.data || {};
        setSiteTitle(settings.siteTitle || "");
        setSiteDescription(settings.siteDescription || "");
        setDarkMode(settings.darkMode || false);
        setLoading(false);
      })
      .catch(() => {
        const settings = JSON.parse(localStorage.getItem("siteSettings")) || {};
        setSiteTitle(settings.title || "");
        setSiteDescription(settings.description || "");
        setDarkMode(settings.darkMode || false);
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    setSaving(true);
    const newSettings = {
      siteTitle,
      siteDescription,
      darkMode,
    };
    axios
      .put(
        "https://materialblog-server-production.up.railway.app/api/settings",
        newSettings
      )
      .then(() => {
        setSnackbar({
          open: true,
          message: "Ayarlar kaydedildi",
          severity: "success",
        });
        localStorage.setItem("siteSettings", JSON.stringify(newSettings));
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Kaydetme hatası",
          severity: "error",
        });
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Ayarlar
      </Typography>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          maxWidth: 600,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
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

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ borderRadius: 2 }}
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettingsPage;
