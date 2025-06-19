import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Facebook, Instagram, Twitter, Email } from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component={motion.footer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        py: 6,
        px: { xs: 2, sm: 4 },
        mt: 10,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Grid container spacing={4} justifyContent="space-between">
        {/* Hakkında */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Material UI Blog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modern, sade ve kullanıcı dostu bir blog deneyimi sunmayı
            amaçlıyoruz.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <IconButton
              color="inherit"
              href="https://twitter.com"
              target="_blank"
            >
              <Twitter />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://facebook.com"
              target="_blank"
            >
              <Facebook />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://instagram.com"
              target="_blank"
            >
              <Instagram />
            </IconButton>
          </Box>
        </Grid>

        {/* Linkler */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Bağlantılar
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link href="/" color="inherit" underline="hover">
              Ana Sayfa
            </Link>
            <Link href="/category/react" color="inherit" underline="hover">
              React
            </Link>
            <Link href="/category/javascript" color="inherit" underline="hover">
              Javascript
            </Link>
          </Box>
        </Grid>

        {/* Abonelik Alanı */}
        <Grid item xs={12} sm={12} md={6}>
          <Typography variant="h6" gutterBottom>
            E-posta aboneliği
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Yeni içeriklerden haberdar olmak için e-posta adresinizi bırakın.
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxWidth: 500 }}
            onSubmit={(e) => e.preventDefault()}
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
              sx={{ flexGrow: 1, bgcolor: "background.default" }}
            />
            <Button type="submit" variant="contained">
              Gönder
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mt: 6 }}
      >
        © {currentYear} Material UI Blog. Tüm Hakları Saklıdır.
      </Typography>
    </Box>
  );
};

export default Footer;
