"use client";
import Link from "next/link";

import {
  Button,
  Stack,
} from "@mui/material";

export function QuickActions() {
  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={2}
    >
      <Button
        component={Link}
        href="/dashboard/users/create"
        variant="contained"
      >
        Create User
      </Button>

      <Button
        component={Link}
        href="/dashboard/tenants/create"
        variant="contained"
      >
        Create Tenant
      </Button>

      <Button
        component={Link}
        href="/dashboard/classes/create"
        variant="contained"
      >
        Create Class
      </Button>
    </Stack>
  );
}