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

import type {
  User,
  Tenant,
} from "@prisma/client";

interface UserCardProps {
  user: User & {
    tenant: Tenant | null;
    hasTeacherProfile: boolean;
  };
}
export function UserCard({
  user,
}: UserCardProps) {
  async function handleToggle() {
    const response =
      await fetch(
        `/api/users/${user.id}`,
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
            {user.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {user.phone}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Role
          </Typography>

          <Typography>
            {user.role}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Tenant
          </Typography>

          <Typography>
            {user.tenant?.name ??
              "No Tenant"}
          </Typography>
        </Box>

        <StatusChip
          active={user.isActive}
        />

        <Stack
          direction="row"
          spacing={1}
        >

          {user.role === "TEACHER" &&
            !user.hasTeacherProfile && (
              <Button
                component={Link}
                href={`/dashboard/users/${user.id}/teacher/create`}
                variant="contained"
                size="small"
              >
                Complete Teacher Profile
              </Button>
            )}


          <Button
            component={Link}
            href={`/dashboard/users/${user.id}/edit`}
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
            {user.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Stack>
      </Stack>
    </DataCard>
  );
}