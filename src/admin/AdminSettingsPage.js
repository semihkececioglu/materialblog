import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
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
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // İlk yükleme
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Store güncellenince formu doldur
  useEffect(() => {
    if (settings) {
      setForm({
        siteTitle: settings.siteTitle || "",
        siteDescription: settings.siteDescription || "",
        metaPixelId: settings.metaPixelId || "",
        metaPixelEnabled: Boolean(settings.metaPixelEnabled),
      });
      setTouched({});
      setSubmitting(false);
    }
  }, [settings]);

  // Success sonrası state
  useEffect(() => {
    if (success) {
      setSubmitting(false);
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const hasChanges = useMemo(() => {
    if (!settings) return false;
    return (
      form.siteTitle !== (settings.siteTitle || "") ||
      form.siteDescription !== (settings.siteDescription || "") ||
      form.metaPixelId !== (settings.metaPixelId || "") ||
      form.metaPixelEnabled !== Boolean(settings.metaPixelEnabled)
    );
  }, [form, settings]);

  const errors = useMemo(() => {
    const e = {};
    if (touched.siteTitle && !form.siteTitle.trim())
      e.siteTitle = "Zorunlu alan";
    if (touched.siteDescription && form.siteDescription.length > 400)
      e.siteDescription = "En fazla 400 karakter";
    if (
      touched.metaPixelId &&
      form.metaPixelId &&
      !/^\d{8,20}$/.test(form.metaPixelId)
    )
      e.metaPixelId = "Sadece rakam (8-20)";
    return e;
  }, [form, touched]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      siteTitle: true,
      siteDescription: true,
      metaPixelId: true,
    });
    if (!isValid) return;
    setSubmitting(true);
    dispatch(updateSettings(form));
  };

  const handleReset = () => {
    if (!settings) return;
    setForm({
      siteTitle: settings.siteTitle || "",
      siteDescription: settings.siteDescription || "",
      metaPixelId: settings.metaPixelId || "",
      metaPixelEnabled: Boolean(settings.metaPixelEnabled),
    });
    setTouched({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Subtle gradient background layer */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.dark,
                  0.25
                )} 0%, ${alpha(theme.palette.background.default, 0.6)} 60%)`
              : `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.light,
                  0.18
                )} 0%, ${alpha(theme.palette.background.default, 0.9)} 65%)`,
          maskImage:
            "radial-gradient(circle at 30% 25%, rgba(0,0,0,.9), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={(theme) => ({
            width: 56,
            height: 56,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            background: `linear-gradient(140deg, ${alpha(
              theme.palette.primary.main,
              0.18
            )}, ${alpha(theme.palette.primary.dark, 0.35)})`,
            boxShadow: `0 6px 18px -6px ${alpha(
              theme.palette.primary.main,
              0.4
            )}`,
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              border: `1px solid ${alpha(theme.palette.primary.light, 0.4)}`,
              pointerEvents: "none",
            },
          })}
        >
          <SettingsRoundedIcon color="primary" sx={{ fontSize: 30 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.5px",
              background: (theme) =>
                `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            Site Ayarları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Genel görünüm ve izleme ayarlarını yönetin.
          </Typography>
        </Box>
        {hasChanges && (
          <Chip
            label="Kaydedilmemiş"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        )}
        {success && !hasChanges && (
          <Chip
            icon={<CheckCircleRoundedIcon />}
            label="Güncel"
            color="success"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(14px)",
              background: alpha(theme.palette.background.paper, 0.85),
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: `linear-gradient(120deg, ${alpha(
                  theme.palette.primary.main,
                  0.08
                )}, transparent 60%)`,
                pointerEvents: "none",
              },
            })}
          >
            {loading && (
              <LinearProgress
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  height: 3,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Site Title */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TitleRoundedIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, letterSpacing: ".5px" }}
                  >
                    Site Başlığı
                  </Typography>
                  <Tooltip
                    title="Tarayıcı sekmesi ve SEO başlığı olarak kullanılır."
                    arrow
                  >
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  placeholder="Örn: Material Blog"
                  name="siteTitle"
                  fullWidth
                  size="medium"
                  value={form.siteTitle}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, siteTitle: true }))}
                  error={Boolean(errors.siteTitle)}
                  helperText={errors.siteTitle}
                  InputProps={{
                    sx: (theme) => ({
                      borderRadius: 3,
                      transition: "0.25s",
                      bgcolor: alpha(theme.palette.background.default, 0.4),
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.default, 0.6),
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.primary.main,
                          0.25
                        )}`,
                        background: alpha(
                          theme.palette.background.default,
                          0.9
                        ),
                      },
                    }),
                  }}
                />
              </Box>

              {/* Description */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <NotesRoundedIcon
                    fontSize="small"
                    sx={{ color: "secondary.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, letterSpacing: ".5px" }}
                  >
                    Site Açıklaması
                  </Typography>
                  <Tooltip
                    title="Arama sonuçlarında görünen kısa açıklama."
                    arrow
                  >
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ ml: "auto" }}>
                    <Typography
                      variant="caption"
                      color={
                        form.siteDescription.length > 400
                          ? "error"
                          : "text.secondary"
                      }
                    >
                      {form.siteDescription.length}/400
                    </Typography>
                  </Box>
                </Box>
                <TextField
                  placeholder="Blogunuz hakkında kısa ve açıklayıcı bir özet."
                  name="siteDescription"
                  fullWidth
                  size="medium"
                  multiline
                  rows={4}
                  value={form.siteDescription}
                  onChange={handleChange}
                  onBlur={() =>
                    setTouched((p) => ({ ...p, siteDescription: true }))
                  }
                  error={Boolean(errors.siteDescription)}
                  helperText={errors.siteDescription}
                  InputProps={{
                    sx: (theme) => ({
                      borderRadius: 3,
                      transition: "0.25s",
                      alignItems: "flex-start",
                      bgcolor: alpha(theme.palette.background.default, 0.4),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.default, 0.6),
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.secondary.main,
                          0.25
                        )}`,
                        background: alpha(
                          theme.palette.background.default,
                          0.9
                        ),
                      },
                    }),
                  }}
                />
              </Box>

              {/* Meta Pixel */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <CodeRoundedIcon
                    fontSize="small"
                    sx={{ color: "warning.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, letterSpacing: ".5px" }}
                  >
                    Meta Pixel
                  </Typography>
                  <Tooltip title="Facebook / Meta Pixel ID (opsiyonel)." arrow>
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ ml: "auto" }}>
                    <Chip
                      size="small"
                      label={form.metaPixelEnabled ? "Aktif" : "Pasif"}
                      color={form.metaPixelEnabled ? "success" : "default"}
                      variant={form.metaPixelEnabled ? "filled" : "outlined"}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
                <TextField
                  placeholder="Örn: 123456789012345"
                  name="metaPixelId"
                  fullWidth
                  size="medium"
                  value={form.metaPixelId}
                  onChange={handleChange}
                  onBlur={() =>
                    setTouched((p) => ({ ...p, metaPixelId: true }))
                  }
                  error={Boolean(errors.metaPixelId)}
                  helperText={errors.metaPixelId || "Boş bırakılabilir"}
                  InputProps={{
                    sx: (theme) => ({
                      borderRadius: 3,
                      transition: "0.25s",
                      bgcolor: alpha(theme.palette.background.default, 0.35),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.default, 0.55),
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.warning.main,
                          0.25
                        )}`,
                        background: alpha(
                          theme.palette.background.default,
                          0.9
                        ),
                      },
                    }),
                  }}
                  sx={{ mb: 1.5 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="metaPixelEnabled"
                      checked={form.metaPixelEnabled}
                      onChange={handleChange}
                      color="warning"
                    />
                  }
                  label="Meta Pixel İzlemesini Aç"
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<RestartAltRoundedIcon />}
                  disabled={!hasChanges || submitting || loading}
                  onClick={handleReset}
                  sx={(theme) => ({
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    backdropFilter: "blur(4px)",
                    background: alpha(theme.palette.background.paper, 0.4),
                  })}
                >
                  Sıfırla
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    submitting || loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SaveRoundedIcon />
                    )
                  }
                  disabled={!hasChanges || !isValid || submitting || loading}
                  sx={(theme) => ({
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3.5,
                    minWidth: 190,
                    background: `linear-gradient(90deg, ${
                      theme.palette.primary.main
                    }, ${darken(theme.palette.primary.main, 0.15)})`,
                    boxShadow: `0 6px 16px -6px ${alpha(
                      theme.palette.primary.main,
                      0.45
                    )}`,
                    "&:hover": {
                      background: `linear-gradient(90deg, ${darken(
                        theme.palette.primary.main,
                        0.1
                      )}, ${darken(theme.palette.primary.main, 0.25)})`,
                    },
                    "&:disabled": {
                      background: alpha(
                        theme.palette.action.disabledBackground,
                        0.6
                      ),
                      color: theme.palette.text.disabled,
                      boxShadow: "none",
                    },
                  })}
                >
                  {submitting || loading
                    ? "Kaydediliyor..."
                    : "Değişiklikleri Kaydet"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Status / Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: 3,
              borderRadius: 4,
              position: "sticky",
              top: 32,
              backdropFilter: "blur(12px)",
              background: alpha(theme.palette.background.paper, 0.75),
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            })}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, letterSpacing: ".5px" }}
            >
              Özet
            </Typography>

            <Box
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                fontSize: 13,
                "& .row": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  padding: "6px 10px",
                  borderRadius: 2,
                  background: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )}`,
                },
              })}
            >
              <Box className="row">
                <span>Başlık</span>
                <Chip
                  size="small"
                  label={form.siteTitle ? "Tamam" : "Eksik"}
                  color={form.siteTitle ? "success" : "default"}
                  variant={form.siteTitle ? "filled" : "outlined"}
                />
              </Box>
              <Box className="row">
                <span>Açıklama</span>
                <Chip
                  size="small"
                  label={form.siteDescription ? "Tamam" : "Eksik"}
                  color={form.siteDescription ? "success" : "default"}
                  variant={form.siteDescription ? "filled" : "outlined"}
                />
              </Box>
              <Box className="row">
                <span>Meta Pixel</span>
                <Chip
                  size="small"
                  label={form.metaPixelEnabled ? "Aktif" : "Pasif"}
                  color={form.metaPixelEnabled ? "warning" : "default"}
                  variant={form.metaPixelEnabled ? "filled" : "outlined"}
                />
              </Box>
              <Box className="row">
                <span>Durum</span>
                <Chip
                  size="small"
                  label={
                    submitting || loading
                      ? "Kaydediliyor"
                      : hasChanges
                      ? "Değişiklik Var"
                      : "Güncel"
                  }
                  color={
                    submitting || loading
                      ? "primary"
                      : hasChanges
                      ? "warning"
                      : "success"
                  }
                  variant="outlined"
                />
              </Box>
            </Box>

            <Divider />

            <Typography variant="caption" color="text.secondary">
              Değişiklikleri kaydetmeden ayrılırsanız yaptığınız düzenlemeler
              kaybolur.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
          {error || "Hata oluştu"}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => dispatch(clearSuccess())}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => dispatch(clearSuccess())}
          sx={{ borderRadius: 3 }}
        >
          Ayarlar kaydedildi
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSettingsPage;
