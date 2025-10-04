import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Collapse,
} from "@mui/material";
import { Email, Send, NotificationsActive } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const FooterSubscribe = React.memo(() => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (email && email.includes("@")) {
        setShowSuccess(true);
        setEmail("");
        setTimeout(() => setShowSuccess(false), 3000);
      }
    },
    [email]
  );

  const isEmailValid = useMemo(() => {
    return email && email.includes("@");
  }, [email]);

  // Compact styles
  const containerStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 1.5, // Reduced gap
      height: "100%",
    }),
    []
  );

  const titleStyles = useMemo(
    () => ({
      fontWeight: 600,
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "1rem", // Reduced font size
      display: "flex",
      alignItems: "center",
      gap: 0.5,
    }),
    []
  );

  return (
    <Box sx={containerStyles}>
      {/* Header */}
      <Box>
        <Typography variant="h6" sx={titleStyles}>
          <NotificationsActive sx={{ fontSize: 18 }} />
          Newsletter
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.4,
            fontSize: "0.875rem", // Reduced font size
            mt: 0.5,
          }}
        >
          Güncel yazılarımızı e-postanızda alın.
        </Typography>
      </Box>

      {/* Success Alert */}
      <Collapse in={showSuccess}>
        <Alert
          severity="success"
          sx={{
            borderRadius: 1.5,
            fontSize: "0.8rem",
            py: 0.5,
          }}
        >
          Başarıyla abone oldunuz!
        </Alert>
      </Collapse>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 1.5, // Reduced padding
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.primary.main, 0.02),
          border: (theme) =>
            `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <TextField
          value={email}
          onChange={handleEmailChange}
          variant="outlined"
          size="small"
          placeholder="ornek@email.com"
          fullWidth
          type="email"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1, // Reduced margin
            "& .MuiOutlinedInput-root": {
              backgroundColor: "background.paper",
              fontSize: "0.875rem",
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isEmailValid}
          endIcon={<Send sx={{ fontSize: 14 }} />}
          size="small" // Reduced size
          sx={{
            borderRadius: 1.5,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)",
            },
          }}
        >
          Abone Ol
        </Button>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          mt: "auto",
          p: 1,
          borderRadius: 1.5,
          backgroundColor: alpha("#2196F3", 0.02),
          border: `1px solid ${alpha("#2196F3", 0.08)}`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
            2,500+
          </Box>{" "}
          aktif abone
        </Typography>
      </Box>
    </Box>
  );
});

FooterSubscribe.displayName = "FooterSubscribe";
export default FooterSubscribe;
