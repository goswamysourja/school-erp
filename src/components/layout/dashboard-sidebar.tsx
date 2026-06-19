"use client";

import Link from "next/link";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { usePathname }
  from "next/navigation";

import { navigationItems }
  from "@/config/navigation.config";
import { SidebarProfile }
  from "./sidebar-profile";
interface Props {
  onNavigate?: () => void;

  userName?: string;
  role?: string;
}

export function DashboardSidebar({
  onNavigate,
  userName,
  role,
}: Props) {
  const pathname =
    usePathname();

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        borderRight: 1,
        borderColor: "divider",

        bgcolor:
          "background.paper",

        display: "flex",

        flexDirection:
          "column",
      }}
    >
      <Box
        sx={{
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          School ERP
        </Typography>
      </Box>

      <List
        sx={{
          flex: 1,
        }}
      >
        {navigationItems.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                onClick={
                  onNavigate
                }
                selected={
                  pathname ===
                  item.href
                }
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>

                <ListItemText
                  primary={
                    item.label
                  }
                />
              </ListItemButton>
            );
          }
        )}
      </List>

      {userName &&
  role && (
    <SidebarProfile
      name={userName}
      role={role}
    />
  )}
    </Box>
  );
}