"use client";

import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { MobileMenuButton } from "./mobile-menu-button";

interface Props {
  isMobile: boolean;
  onMenuClick: () => void;
  user: {
    name: string;
    role: string;
  };
}

export function DashboardTopbar({ isMobile, onMenuClick, user }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return { label: "SUPER ADMIN", color: "error" as const };
      case "ADMIN":
        return { label: "ADMIN", color: "primary" as const };
      case "TEACHER":
        return { label: "TEACHER", color: "success" as const };
      default:
        return { label: role.replaceAll("_", " "), color: "default" as const };
    }
  };

  const roleBadge = getRoleBadgeColor(user.role);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 68 },
          px: { xs: 2, sm: 3 },
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && <MobileMenuButton onClick={onMenuClick} />}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              display: { xs: "none", sm: "block" },
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* Right User Control Group */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Role Chip */}
          <Chip
            label={roleBadge.label}
            color={roleBadge.color}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 24,
              borderRadius: 1,
            }}
          />

          {/* User Avatar Button */}
          <IconButton
            onClick={handleOpenUserMenu}
            size="small"
            sx={{
              p: 0.5,
              border: "1px solid",
              borderColor: anchorEl ? "primary.main" : "divider",
              transition: "border-color 0.2s",
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
          </IconButton>

          {/* User Details Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            onClick={handleCloseUserMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  py: 0.5,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "capitalize" }}
              >
                {user.role.replaceAll("_", " ").toLowerCase()}
              </Typography>
            </Box>

            <MenuItem
              onClick={handleCloseUserMenu}
              sx={{ py: 1, mx: 0.5, borderRadius: 1 }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Account Settings"
                slotProps={{
                  primary: {
                    sx: { fontSize: "0.875rem" },
                  },
                }}
              />
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1,
                mx: 0.5,
                borderRadius: 1,
                color: "error.main",
                "&:hover": { bgcolor: "error.50" },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                slotProps={{
                  primary: {
                    sx: { fontSize: "0.875rem", fontWeight: 600 },
                  },
                }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}