import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#1e1e1e",
            },
            background: {
              default: "#f9f9f9",
              paper: "#fff",
            },
          }
        : {
            primary: {
              main: "#90caf9",
            },
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
  });
