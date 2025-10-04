import React, { Suspense, lazy, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Container,
  Divider,
  Stack,
  Skeleton,
} from "@mui/material";

// Lazy load footer components
const FooterAbout = lazy(() => import("./FooterAbout"));
const FooterLinks = lazy(() => import("./FooterLinks"));
const FooterSubscribe = lazy(() => import("./FooterSubscribe"));

// Compact skeleton
const FooterSkeleton = React.memo(() => (
  <Box sx={{ p: 1.5 }}>
    <Skeleton variant="text" width="50%" height={24} />
    <Skeleton variant="text" width="70%" height={14} sx={{ mt: 0.5 }} />
    <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 1 }} />
  </Box>
));

const Footer = React.memo(() => {
  const theme = useTheme();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Compact styles
  const footerStyles = useMemo(
    () => ({
      mt: { xs: 4, md: 6 }, // Reduced margin
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(15,25,35,0.95), rgba(25,35,50,0.9))"
            : "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(241,245,249,0.9))",
        backdropFilter: "blur(20px)", // Reduced blur
        WebkitBackdropFilter: "blur(20px)",
        zIndex: -1,
      },
      borderTop: `1px solid ${theme.palette.divider}`,
      borderRadius: { xs: "16px 16px 0 0", md: "20px 20px 0 0" }, // Reduced radius
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 -4px 20px rgba(0,0,0,0.2)"
          : "0 -4px 20px rgba(0,0,0,0.08)",
    }),
    [theme.palette.mode, theme.palette.divider]
  );

  const dividerStyles = useMemo(
    () => ({
      my: 2, // Reduced margin
      background:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.08)",
      height: "1px",
    }),
    [theme.palette.mode]
  );

  return (
    <Box component="footer" sx={footerStyles}>
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 4 } }}>
          {" "}
          {/* Reduced padding */}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }} // Reduced spacing
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={12} md={4}>
              <Suspense fallback={<FooterSkeleton />}>
                <FooterAbout />
              </Suspense>
            </Grid>

            <Grid item xs={12} md={3}>
              <Suspense fallback={<FooterSkeleton />}>
                <FooterLinks />
              </Suspense>
            </Grid>

            <Grid item xs={12} md={4}>
              <Suspense fallback={<FooterSkeleton />}>
                <FooterSubscribe />
              </Suspense>
            </Grid>
          </Grid>
          <Divider sx={dividerStyles} />
          {/* Compact copyright */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              © {currentYear} Material UI Blog. Tüm Hakları Saklıdır.
            </Typography>

            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 400,
                textAlign: { xs: "center", sm: "right" },
              }}
            >
              React.js ile geliştirildi
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
});

Footer.displayName = "Footer";
export default Footer;
