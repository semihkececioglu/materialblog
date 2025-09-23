import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Tooltip,
  Fade,
  Grow,
  Stack,
  Snackbar,
} from "@mui/material";
import {
  LocationOn,
  Email,
  Phone,
  Send,
  PersonOutline,
  MessageOutlined,
  EmailOutlined,
  CheckCircle,
  Info,
} from "@mui/icons-material";
import axios from "axios";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Ad gereklidir";
    if (!form.email.trim()) newErrors.email = "E-posta gereklidir";
    if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Geçerli bir e-posta girin";
    if (!form.message.trim()) newErrors.message = "Mesaj gereklidir";
    if (form.message.length < 10)
      newErrors.message = "Mesaj en az 10 karakter olmalıdır";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(
        "https://materialblog-server-production.up.railway.app/api/contact",
        form
      );
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Ana İçerik Grid - Yan Yana */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ minHeight: "calc(100vh - 200px)" }}
        >
          {/* Form - Sol Taraf */}
          <Grid item xs={12} md={5}>
            <Grow in timeout={1000}>
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid #e3f2fd",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(26, 35, 126, 0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Form Başlığı */}
                <Box mb={3}>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    sx={{
                      color: "#1a237e",
                      mb: 1,
                      background:
                        "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Bize Ulaşın
                  </Typography>
                </Box>

                <form
                  onSubmit={handleSubmit}
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                      flex: 1,
                    }}
                  >
                    {/* Name Field */}
                    <TextField
                      label="Adınız Soyadınız"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (
                          <PersonOutline sx={{ mr: 2, color: "#5e35b1" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "& fieldset": {
                            border: "2px solid #e1bee7",
                            borderRadius: 3,
                          },
                          "&:hover": {
                            backgroundColor: "#fafafa",
                            "& fieldset": {
                              borderColor: "#9c27b0",
                              boxShadow: "0 0 0 3px rgba(156, 39, 176, 0.1)",
                            },
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#5e35b1",
                            borderWidth: 2,
                            boxShadow: "0 0 0 3px rgba(94, 53, 177, 0.1)",
                          },
                          "& input": {
                            color: "#424242",
                            fontSize: "1rem",
                            py: 1,
                          },
                        },
                      }}
                      required
                    />

                    {/* Email Field */}
                    <TextField
                      label="E-posta Adresiniz"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <EmailOutlined sx={{ mr: 2, color: "#1976d2" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "& fieldset": {
                            border: "2px solid #bbdefb",
                            borderRadius: 3,
                          },
                          "&:hover": {
                            backgroundColor: "#fafafa",
                            "& fieldset": {
                              borderColor: "#2196f3",
                              boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.1)",
                            },
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                            boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                          },
                          "& input": {
                            color: "#424242",
                            fontSize: "1rem",
                            py: 1,
                          },
                        },
                      }}
                      required
                    />

                    {/* Message Field */}
                    <TextField
                      label="Mesajınız"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      fullWidth
                      error={!!errors.message}
                      helperText={
                        errors.message || `${form.message.length}/500 karakter`
                      }
                      inputProps={{ maxLength: 500 }}
                      InputProps={{
                        startAdornment: (
                          <MessageOutlined
                            sx={{
                              mr: 2,
                              color: "#388e3c",
                              alignSelf: "flex-start",
                              mt: 2,
                            }}
                          />
                        ),
                      }}
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "& fieldset": {
                            border: "2px solid #c8e6c9",
                            borderRadius: 3,
                          },
                          "&:hover": {
                            backgroundColor: "#fafafa",
                            "& fieldset": {
                              borderColor: "#4caf50",
                              boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
                            },
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#388e3c",
                            borderWidth: 2,
                            boxShadow: "0 0 0 3px rgba(56, 142, 60, 0.1)",
                          },
                          "& textarea": {
                            color: "#424242",
                            fontSize: "1rem",
                          },
                        },
                      }}
                      required
                    />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={<Send />}
                      sx={{
                        mt: 1,
                        py: 1.5,
                        px: 4,
                        fontWeight: "600",
                        fontSize: "1rem",
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        textTransform: "none",
                        transition: "all 0.4s ease",
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                          transform: "translateY(-3px)",
                          boxShadow: "0 12px 35px rgba(102, 126, 234, 0.6)",
                        },
                        "&:active": {
                          transform: "translateY(-1px)",
                        },
                        "&:disabled": {
                          background:
                            "linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)",
                          color: "#fff",
                          transform: "none",
                          boxShadow: "0 2px 8px rgba(189, 189, 189, 0.3)",
                        },
                      }}
                    >
                      {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grow>
          </Grid>

          {/* İletişim Bilgileri Cards - Sağ Taraf */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2} sx={{ height: "100%" }}>
              {/* Bilgi Kartı */}
              <Grow in timeout={800}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Info sx={{ fontSize: 24 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 0.2, fontSize: "1rem" }}
                      >
                        Hızlı İletişim
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, fontSize: "0.85rem" }}
                      >
                        7/24 destek için aşağıdaki bilgileri kullanın.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grow>

              {/* İletişim Kartları */}
              {[
                {
                  icon: <LocationOn />,
                  title: "Adres",
                  info: "İstanbul, Türkiye",
                  color: "#e91e63",
                  bgColor: "#fce4ec",
                },
                {
                  icon: <Email />,
                  title: "E-posta",
                  info: "semihkecec@gmail.com",
                  color: "#2196f3",
                  bgColor: "#e3f2fd",
                },
                {
                  icon: <Phone />,
                  title: "Telefon",
                  info: "+90 555 555 55 55",
                  color: "#4caf50",
                  bgColor: "#e8f5e8",
                },
              ].map((item, index) => (
                <Grow in timeout={1000 + index * 150} key={index}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      border: `2px solid ${item.color}20`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      flex: 1,
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.01)",
                        boxShadow: `0 12px 28px ${item.color}25`,
                        borderColor: `${item.color}40`,
                        background: `linear-gradient(135deg, ${item.bgColor} 0%, #ffffff 100%)`,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          color: item.color,
                          p: 1.5,
                          borderRadius: 3,
                          backgroundColor: `${item.color}10`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          minWidth: 42,
                          minHeight: 42,
                          "&:hover": {
                            backgroundColor: `${item.color}20`,
                            transform: "scale(1.1) rotate(3deg)",
                          },
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          sx: { fontSize: 20 },
                        })}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#424242",
                            fontWeight: 600,
                            mb: 0.2,
                            fontSize: "0.9rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#757575",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {item.info}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grow>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Harita */}
        <Box mt={6}>
          <Grow in timeout={1800}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 6,
                overflow: "hidden",
                p: 1,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "2px solid #e3f2fd",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 16px 48px rgba(26, 35, 126, 0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <iframe
                title="Google Maps Istanbul"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12041.475262663867!2d28.978358!3d41.008238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba2d5d0a4db7%3A0x4b3e44fa85e58c32!2sIstanbul!5e0!3m2!1str!2str!4v1693220000000!5m2!1str!2str"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "20px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Paper>
          </Grow>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          bottom: { xs: 24, md: 32 },
          "& .MuiSnackbarContent-root": {
            borderRadius: 4,
            minWidth: 350,
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{
            width: "100%",
            borderRadius: 4,
            backgroundColor: "#4caf50",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)",
            "& .MuiAlert-icon": {
              color: "#ffffff",
              fontSize: "1.5rem",
            },
            "& .MuiAlert-action": {
              color: "#ffffff",
            },
          }}
        >
          Mesajınız başarıyla gönderildi! Teşekkür ederiz.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
