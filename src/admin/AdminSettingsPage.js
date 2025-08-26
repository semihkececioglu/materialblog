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
  Container,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CodeIcon from "@mui/icons-material/Code"; // Pixel ikonu için
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
    metaPixelId: "",
    metaPixelEnabled: false,
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setForm({
        siteTitle: settings.siteTitle || "",
        siteDescription: settings.siteDescription || "",
        metaPixelId: settings.metaPixelId || "",
        metaPixelEnabled: settings.metaPixelEnabled || false,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(form));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <SettingsIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Site Ayarları
            </Typography>
            <Chip
              label="Genel Ayarlar"
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: 500,
                height: "24px",
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Settings Form */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Site Title */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TitleIcon sx={{ color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Site Başlığı
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="siteTitle"
                value={form.siteTitle}
                onChange={handleChange}
                placeholder="Örn: Benim Blogum"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      alpha(theme.palette.background.paper, 0.6),
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Site Description */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <DescriptionIcon sx={{ color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Site Açıklaması
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="siteDescription"
                value={form.siteDescription}
                onChange={handleChange}
                placeholder="Sitenizi kısaca tanımlayın..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      alpha(theme.palette.background.paper, 0.6),
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Meta Pixel */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CodeIcon sx={{ color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Meta Pixel
                </Typography>
                <Tooltip
                  title="Facebook / Meta Pixel izleme kodu için ID. Admin panelden açıp kapatabilirsiniz."
                  arrow
                  placement="top"
                >
                  <IconButton size="small">
                    <InfoOutlinedIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                name="metaPixelId"
                value={form.metaPixelId}
                onChange={handleChange}
                placeholder="Örn: 2138030663390234"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      alpha(theme.palette.background.paper, 0.6),
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.metaPixelEnabled}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        metaPixelEnabled: e.target.checked,
                      }))
                    }
                    name="metaPixelEnabled"
                  />
                }
                label="Meta Pixel'i Aktif Et"
              />
            </Box>

            {/* Submit */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                }}
              >
                Varsayılana Döndür
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                }}
              >
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => {}}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => dispatch(clearSuccess())}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Ayarlar başarıyla kaydedildi
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSettingsPage;
