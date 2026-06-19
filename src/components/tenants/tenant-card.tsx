"use client";

import Link from "next/link";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import { DataCard }
  from "@/components/ui/data-card";

import { StatusChip }
  from "@/components/ui/status-chip";

import type { Tenant }
  from "@/modules/tenants/types/tenant.types";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({
  tenant,
}: TenantCardProps) {
  async function handleToggle() {
    const response =
      await fetch(
        `/api/tenants/${tenant.id}`,
        {
          method: "DELETE",
        }
      );

    const data =
      await response.json();

    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  }

  return (
    <DataCard>
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            {tenant.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {tenant.slug}
          </Typography>
        </Box>

        <StatusChip
          active={tenant.isActive}
        />

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            component={Link}
            href={`/dashboard/tenants/${tenant.id}/edit`}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>

          <Button
            onClick={handleToggle}
            variant="contained"
            size="small"
          >
            {tenant.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Stack>
      </Stack>
    </DataCard>
  );
}