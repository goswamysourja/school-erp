"use client";

import {
  Box,
  Divider,
  Typography,
} from "@mui/material";

import { LogoutButton }
  from "./logout-button";

interface Props {
  name: string;
  role: string;
}

export function SidebarProfile({
  name,
  role,
}: Props) {
  return (
    <Box>
      <Divider />

      <Box
        sx={{
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {role.replaceAll(
            "_",
            " "
          )}
        </Typography>

        <Box
          sx={{
            mt: 2,
          }}
        >
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
}