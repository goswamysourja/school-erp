"use client";

import { useState } from "react";

import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import type {
  Role,
  StaffDesignation,
} from "@prisma/client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

interface DashboardShellProps {
  children: React.ReactNode;

  user: {
    name: string;
    role: Role;
    designation: StaffDesignation | null;
  };

  hasLibraryAccess?: boolean;
}

export function DashboardShell({
  children,
  user,
  hasLibraryAccess = false,
}: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md"),
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "grey.50",
      }}
    >
      {isMobile ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
        >
          <DashboardSidebar
            onNavigate={() => setOpen(false)}
            role={user.role}
            designation={user.designation}
            hasLibraryAccess={hasLibraryAccess}
          />
        </Drawer>
      ) : (
        <DashboardSidebar
          role={user.role}
          designation={user.designation}
          hasLibraryAccess={hasLibraryAccess}
        />
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <DashboardTopbar
          isMobile={isMobile}
          onMenuClick={() => setOpen(true)}
          user={user}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: {
              xs: 2.5,
              sm: 3.5,
              md: 4,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}