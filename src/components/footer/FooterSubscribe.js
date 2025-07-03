import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { Email } from "@mui/icons-material";

const FooterSubscribe = () => (
  <Box item xs={12} sm={12} md={6}>
    <Typography variant="h6" gutterBottom>
      E-posta aboneliği
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      Yeni içeriklerden haberdar olmak için e-posta adresinizi bırakın.
    </Typography>
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        maxWidth: 500,
        bgcolor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(6px)",
        borderRadius: "12px",
        p: 1,
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="E-posta adresiniz"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        }}
        sx={{
          flexGrow: 1,
          input: { bgcolor: "transparent" },
        }}
      />
      <Button type="submit" variant="contained" sx={{ borderRadius: "12px" }}>
        Gönder
      </Button>
    </Box>
  </Box>
);

export default FooterSubscribe;
