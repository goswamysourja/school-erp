"use client";

import * as React from "react";

import {
  AppRouterCacheProvider,
} from "@mui/material-nextjs/v15-appRouter";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1976d2",
    },
  },

  shape: {
    borderRadius: 10,
  },
});

export function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}