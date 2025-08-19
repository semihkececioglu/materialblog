// src/admin/AdminSettingsPage.jsx
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
  Switch,
  FormControlLabel,
  Stack,
  Tooltip,
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

  // 🔹 GA alanları
  const [gaEnabled, setGaEnabled] = useState(false);
  const [gaMeasurementId, setGaMeasurementId] = useState("");

  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setSiteTitle(settings.siteTitle || "");
      setSiteDescription(settings.siteDescription || "");
      setGaEnabled(Boolean(settings.gaEnabled));
      setGaMeasurementId(settings.gaMeasurementId || "");
    }
  }, [settings]);

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
    // Basit doğrulama: GA açıkken ID boş olmasın
    if (gaEnabled && !/^G-[A-Z0-9]+$/i.test(gaMeasurementId.trim())) {
      setSnackbar({
        open: true,
        message: "Geçerli bir GA4 Measurement ID girin (örn. G-ABCD1234)",
        severity: "warning",
      });
      return;
    }

    setSaving(true);
    dispatch(
      updateSettings({
        siteTitle,
        siteDescription,
        gaEnabled,
        gaMeasurementId: gaMeasurementId.trim(),
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
          maxWidth: 720,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Site Başlığı"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Site Açıklaması"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            multiline
            rows={3}
          />

          {/* 🔹 Google Analytics Alanları */}
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
            Google Analytics (GA4)
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={gaEnabled}
                onChange={(e) => setGaEnabled(e.target.checked)}
              />
            }
            label="Google Analytics'i etkinleştir"
          />

          <Tooltip
            title="GA4 → Admin → Data Streams → Web → Measurement ID (G-XXXX...)"
            arrow
          >
            <TextField
              fullWidth
              label="GA4 Measurement ID (G-XXXXXXX)"
              value={gaMeasurementId}
              onChange={(e) => setGaMeasurementId(e.target.value)}
              placeholder="G-ABCD1234"
              disabled={!gaEnabled}
              helperText={
                gaEnabled
                  ? "Örnek: G-ABCD1234 — SPA takip için otomatik kullanılacak."
                  : "Önce GA'yı etkinleştirin."
              }
            />
          </Tooltip>

          <Box>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </Box>
        </Stack>
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
