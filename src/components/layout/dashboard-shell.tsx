"use client";

import { useState } from "react";

import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { DashboardSidebar }
  from "./dashboard-sidebar";

import { DashboardTopbar }
  from "./dashboard-topbar";

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;

  user: {
    name: string;
    role: string;
  };
}) {
  const [open, setOpen] =
    useState(false);

  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down("md")
    );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {isMobile ? (
        <Drawer
          open={open}
          onClose={() =>
            setOpen(false)
          }
        >
          <DashboardSidebar
  onNavigate={() =>
    setOpen(false)
  }
  userName={user.name}
  role={user.role}
/>
        </Drawer>
      ) : (
        <DashboardSidebar
  userName={user.name}
  role={user.role}
/>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection:
            "column",
        }}
      >
        <DashboardTopbar
          isMobile={
            isMobile
          }
          onMenuClick={() =>
            setOpen(true)
          }
        />

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}