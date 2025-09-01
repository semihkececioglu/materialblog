import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Email,
  Send,
  CheckCircle,
  TrendingUp,
  Close,
  NotificationsActive,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubmitted(true);
      setShowSuccess(true);
      setEmail("");

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {/* Header Section */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <NotificationsActive
            sx={{
              color: "primary.main",
              fontSize: 20,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Newsletter
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            mb: 1.5,
          }}
        >
          En güncel yazılar ve teknoloji haberlerini doğrudan e-postanızda alın.
        </Typography>

        {/* Benefits */}
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
          {[
            { icon: TrendingUp, label: "Haftalık Özet" },
            { icon: CheckCircle, label: "Spam Yok" },
          ].map(({ icon: Icon, label }) => (
            <Chip
              key={label}
              icon={<Icon sx={{ fontSize: 14 }} />}
              label={label}
              size="small"
              variant="outlined"
              sx={{
                height: 24,
                fontSize: "0.625rem",
                borderColor: alpha("#2196F3", 0.3),
                color: "text.secondary",
                "& .MuiChip-icon": {
                  fontSize: 14,
                  color: "primary.main",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Success Alert */}
      <Collapse in={showSuccess}>
        <Alert
          severity="success"
          action={
            <IconButton size="small" onClick={() => setShowSuccess(false)}>
              <Close fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: 20,
            },
          }}
        >
          Başarıyla abone oldunuz! E-postanızı kontrol edin.
        </Alert>
      </Collapse>

      {/* Subscribe Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 203, 243, 0.08) 100%)"
                : "linear-gradient(135deg, rgba(33, 150, 243, 0.04) 0%, rgba(33, 203, 243, 0.04) 100%)",
            borderRadius: 3,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="ornek@email.com"
            fullWidth
            type="email"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: alpha("#fff", 0.8),
                backdropFilter: "blur(8px)",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: alpha("#fff", 0.9),
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: alpha("#fff", 1),
                  boxShadow: `0 0 0 2px ${alpha("#2196F3", 0.2)}`,
                },
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "0.875rem",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!email || !email.includes("@")}
            endIcon={<Send sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: `0 4px 12px ${alpha("#2196F3", 0.3)}`,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)",
                boxShadow: `0 6px 16px ${alpha("#2196F3", 0.4)}`,
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: alpha("#999", 0.3),
                color: alpha("#fff", 0.5),
                boxShadow: "none",
              },
            }}
          >
            Abone Ol
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          mt: "auto",
          p: 1.5,
          borderRadius: 2,
          backgroundColor: alpha("#2196F3", 0.02),
          border: `1px solid ${alpha("#2196F3", 0.08)}`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        >
          <Box
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            2,500+
          </Box>{" "}
          aktif abone
        </Typography>
      </Box>
    </Box>
  );
};

export default FooterSubscribe;
