import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSettings,
  updateSettings,
  clearSuccess,
} from "../redux/settingsSlice";

const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const {
    data: settings,
    loading,
    success,
  } = useSelector((state) => state.settings);

  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Ayarları Redux üzerinden çek
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Redux verileri geldiğinde inputlara aktar
  useEffect(() => {
    if (settings) {
      setSiteTitle(settings.siteTitle || "");
      setSiteDescription(settings.siteDescription || "");
    }
  }, [settings]);

  // Başarılı güncelleme sonrası snackbar göster
  useEffect(() => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Ayarlar kaydedildi",
        severity: "success",
      });
      dispatch(clearSuccess());
      setSaving(false);
    }
  }, [success, dispatch]);

  const handleSave = () => {
    setSaving(true);
    dispatch(
      updateSettings({
        siteTitle,
        siteDescription,
      })
    ).catch(() => {
      setSnackbar({
        open: true,
        message: "Kaydetme hatası",
        severity: "error",
      });
      setSaving(false);
    });
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
