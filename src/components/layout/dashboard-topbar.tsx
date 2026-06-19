"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import { MobileMenuButton }
  from "./mobile-menu-button";

interface Props {
  isMobile: boolean;
  onMenuClick: () => void;
}

export function DashboardTopbar({
  isMobile,
  onMenuClick,
}: Props) {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar>
        {isMobile && (
          <MobileMenuButton
            onClick={onMenuClick}
          />
        )}

        <Box
          sx={{
            ml: isMobile ? 1 : 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            School ERP
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}