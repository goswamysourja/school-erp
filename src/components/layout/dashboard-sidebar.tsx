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
import SchoolIcon from "@mui/icons-material/School";

import { usePathname } from "next/navigation";
import { navigationItems } from "@/config/navigation.config";
import { Role } from "@prisma/client";

interface Props {
  onNavigate?: () => void;
  role?: string;
}

export function DashboardSidebar({ onNavigate, role }: Props) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 250,
        minHeight: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <SchoolIcon fontSize="small" />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            School ERP
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500, fontSize: "0.725rem" }}
          >
            Management Platform
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <Box sx={{ px: 1.5, py: 1, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            pb: 1,
            display: "block",
            fontWeight: 700,
            fontSize: "0.68rem",
            color: "text.secondary",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Menu
        </Typography>

        <List disablePadding>
          {navigationItems
            .filter((item) => item.roles.includes(role as Role))
            .map((item) => {
              const Icon = item.icon;
              const isSelected = pathname === item.href;

              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={onNavigate}
                  selected={isSelected}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 40,
                    px: 1.5,
                    color: isSelected ? "primary.main" : "text.secondary",
                    "&.Mui-selected": {
                      bgcolor: "primary.50",
                      fontWeight: 700,
                      "&:hover": {
                        bgcolor: "primary.100",
                      },
                    },
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "text.primary",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 34,
                      color: isSelected ? "primary.main" : "text.secondary",
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Box>
    </Box>
  );
}