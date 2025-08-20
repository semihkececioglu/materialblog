import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSettings,
  updateSettings,
  clearSuccess,
  selectSettings,
  selectSettingsLoading,
  selectSettingsError,
  selectSettingsSuccess,
} from "../redux/settingsSlice";

const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const loading = useSelector(selectSettingsLoading);
  const error = useSelector(selectSettingsError);
  const success = useSelector(selectSettingsSuccess);

  const [form, setForm] = useState({
    siteTitle: "",
    siteDescription: "",
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setForm({
        siteTitle: settings.siteTitle || "",
        siteDescription: settings.siteDescription || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(form));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Site Ayarları
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Site Başlığı"
            name="siteTitle"
            value={form.siteTitle}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Site Açıklaması"
            name="siteDescription"
            value={form.siteDescription}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <Box mt={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Kaydet"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => {}}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => dispatch(clearSuccess())}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">Ayarlar başarıyla kaydedildi</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettingsPage;
