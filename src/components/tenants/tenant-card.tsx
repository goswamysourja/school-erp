"use client";

import Link from "next/link";

import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { DataCard }
  from "@/components/ui/data-card";

import type { Tenant }
  from "@/modules/tenants/types/tenant.types";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({
  tenant,
}: TenantCardProps) {
  const statusLabel =
    tenant.status.replaceAll(
      "_",
      " "
    );

  const canToggle =
    tenant.status === "ACTIVE" ||
    tenant.status === "INACTIVE";

  async function handleToggle() {
    if (!canToggle) {
      return;
    }

    const nextStatus =
      tenant.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const response =
      await fetch(
        `/api/tenants/${tenant.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
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

        <Chip
          label={statusLabel}
          variant="outlined"
          sx={{
            width: "fit-content",
            textTransform: "capitalize",
          }}
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

          {canToggle && (
            <Button
              onClick={handleToggle}
              variant="contained"
              size="small"
            >
              {tenant.status === "ACTIVE"
                ? "Deactivate"
                : "Activate"}
            </Button>
          )}
        </Stack>
      </Stack>
    </DataCard>
  );
}