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
} from "@mui/material";
import {
  LocationOn,
  Email,
  Phone,
  Send,
  PersonOutline,
  MessageOutlined,
  EmailOutlined,
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
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
    setLoading(false);
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
        {/* Başlık */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              fontWeight="700"
              gutterBottom
              sx={{
                color: "#1a237e",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 2,
                textShadow: "0 2px 4px rgba(26, 35, 126, 0.3)",
                background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              İletişim
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#424242",
                fontWeight: 400,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Bizimle iletişime geçmek için formu doldurun. Size en kısa sürede
              geri dönüş yapacağız.
            </Typography>
          </Box>
        </Fade>

        {/* Ana İçerik Grid */}
        <Grid container spacing={6} justifyContent="center">
          {/* Form */}
          <Grid item xs={12} lg={8}>
            <Grow in timeout={1000}>
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid #e3f2fd",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(26, 35, 126, 0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {success && (
                  <Fade in={success}>
                    <Alert
                      severity="success"
                      sx={{
                        mb: 4,
                        borderRadius: 3,
                        backgroundColor: "#e8f5e8",
                        color: "#2e7d32",
                        border: "1px solid #4caf50",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                      }}
                    >
                      ✨ Mesajınız başarıyla gönderildi! Teşekkür ederiz.
                    </Alert>
                  </Fade>
                )}

                <form onSubmit={handleSubmit}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {/* Name Field */}
                    <Tooltip title="Tam adınızı yazın" placement="top">
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
                              fontSize: "1.1rem",
                              py: 1.5,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#757575",
                            fontSize: "1.1rem",
                            "&.Mui-focused": {
                              color: "#5e35b1",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            color: "#f44336",
                            fontSize: "0.9rem",
                            mt: 1,
                          },
                        }}
                        required
                      />
                    </Tooltip>

                    {/* Email Field */}
                    <Tooltip
                      title="Geçerli bir e-posta adresi girin"
                      placement="top"
                    >
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
                              fontSize: "1.1rem",
                              py: 1.5,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#757575",
                            fontSize: "1.1rem",
                            "&.Mui-focused": {
                              color: "#1976d2",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            color: "#f44336",
                            fontSize: "0.9rem",
                            mt: 1,
                          },
                        }}
                        required
                      />
                    </Tooltip>

                    {/* Message Field */}
                    <Tooltip
                      title="Mesajınızı detaylı olarak yazın (min. 10 karakter)"
                      placement="top"
                    >
                      <TextField
                        label="Mesajınız"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        multiline
                        rows={6}
                        fullWidth
                        error={!!errors.message}
                        helperText={
                          errors.message ||
                          `${form.message.length}/500 karakter`
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
                              fontSize: "1.1rem",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#757575",
                            fontSize: "1.1rem",
                            "&.Mui-focused": {
                              color: "#388e3c",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            color: errors.message ? "#f44336" : "#757575",
                            fontSize: "0.9rem",
                            mt: 1,
                          },
                        }}
                        required
                      />
                    </Tooltip>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      disabled={loading}
                      startIcon={<Send />}
                      sx={{
                        mt: 2,
                        py: 1.8,
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
                        alignSelf: "center",
                        maxWidth: "300px",
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
        </Grid>

        {/* İletişim Bilgileri Cards */}
        <Box mt={10}>
          <Grid container spacing={4} justifyContent="center">
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
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={1200 + index * 200}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      textAlign: "center",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      border: `2px solid ${item.color}20`,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: `0 20px 40px ${item.color}30`,
                        borderColor: `${item.color}60`,
                        background: `linear-gradient(135deg, ${item.bgColor} 0%, #ffffff 100%)`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: item.color,
                        mb: 3,
                        p: 3,
                        borderRadius: "50%",
                        backgroundColor: `${item.color}15`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: `${item.color}25`,
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    >
                      {React.cloneElement(item.icon, { sx: { fontSize: 36 } })}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#424242",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#757575",
                        fontSize: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      {item.info}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Harita */}
        <Box mt={10}>
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
                height="400"
                style={{ border: 0, borderRadius: "20px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Paper>
          </Grow>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
