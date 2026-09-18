"use client";

import Link from "next/link";

import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Subject,
} from "@prisma/client";

import { DataCard }
  from "@/components/ui/data-card";

import { StatusChip }
  from "@/components/ui/status-chip";

interface Props {
  subject: Subject;
}

export function SubjectCard({
  subject,
}: Props) {
  async function handleToggle() {
    try {
      const response =
        await fetch(
          `/api/subjects/${subject.id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message
        );
      }

      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  return (
    <DataCard>
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {subject.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Code: {subject.code}
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={1}>
          <Typography
            variant="body2"
          >
            <strong>
              Description:
            </strong>{" "}
            {subject.description ??
              "-"}
          </Typography>

        </Stack>

        <Box>
          <StatusChip
            active={
              subject.isActive
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Link
            href={`/dashboard/subjects/${subject.id}/edit`}
            style={{
              textDecoration: "none",
            }}
          >
            <Button variant="outlined">
              Edit
            </Button>
          </Link>

          <Button
            variant="contained"
            color={
              subject.isActive
                ? "error"
                : "success"
            }
            onClick={
              handleToggle
            }
          >
            {subject.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Box>
      </Stack>
    </DataCard>
  );
}