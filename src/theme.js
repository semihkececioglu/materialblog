import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#1e1e1e" },
            background: {
              default: "#f9f9f9",
              paper: "#fff",
            },
          }
        : {
            primary: { main: "#90caf9" },
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 14,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor:
              mode === "dark"
                ? "rgba(255,255,255,0.1) transparent"
                : "rgba(0,0,0,0.1) transparent",
          },
          "*::-webkit-scrollbar": {
            width: "6px",
          },
          "*::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor:
              mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
            borderRadius: "8px",
            backdropFilter: "blur(6px)",
            transition: "all 0.3s ease",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
                : "linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            ...(mode === "dark" && {
              backgroundColor: "rgba(255,255,255,0.04)",
            }),
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backdropFilter: "blur(14px)",
            backgroundColor: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.2)",
            ...(mode === "dark" && {
              backgroundColor: "rgba(255,255,255,0.05)",
            }),
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.15)",
            ...(mode === "dark" && {
              backgroundColor: "rgba(255,255,255,0.03)",
            }),
          },
        },
      },
    },
  });
