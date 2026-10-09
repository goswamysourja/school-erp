"use client";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  return (
    <Tooltip title="Logout">
      <IconButton
        onClick={handleLogout}
        aria-label="Logout"
        size="small"
        sx={{
          ml: 0.5,
          color: "text.secondary",

          "&:hover": {
            color: "error.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}