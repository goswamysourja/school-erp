"use client";

import Link from "next/link";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import { DataCard } from "@/components/ui/data-card";

import { StatusChip } from "@/components/ui/status-chip";

import type { Class } from "@prisma/client";

interface ClassCardProps {
  classItem: Class;
}

export function ClassCard({
  classItem,
}: ClassCardProps) {
  async function handleToggle() {
    const response =
      await fetch(
        `/api/classes/${classItem.id}`,
        {
          method: "DELETE",
        },
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
            Class {classItem.name}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Academic Year
          </Typography>

          <Typography>
            {classItem.academicYear}
          </Typography>
        </Box>

        <StatusChip
          active={classItem.isActive}
        />

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            component={Link}
            href={`/dashboard/sections?classId=${classItem.id}`}
            variant="contained"
            size="small"
          >
            Manage Sections
          </Button>

          <Button
            component={Link}
            href={`/dashboard/classes/${classItem.id}/edit`}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>

          <Button
            onClick={handleToggle}
            variant="outlined"
            size="small"
          >
            {classItem.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Stack>
      </Stack>
    </DataCard>
  );
}