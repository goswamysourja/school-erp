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
  Student,
  Tenant,
  Class,
} from "@prisma/client";

import { DataCard }
  from "@/components/ui/data-card";

import { StatusChip }
  from "@/components/ui/status-chip";

interface Props {
  student: Student & {
    tenant: Tenant;
    class: Class;
  };
}

export function StudentCard({
  student,
}: Props) {
  async function handleToggle() {
    const response =
      await fetch(
        `/api/students/${student.id}`,
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
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            {student.firstName}{" "}
            {student.lastName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Admission No:
            {" "}
            {student.admissionNumber}
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={1}>
          <Typography
            variant="body2"
          >
            <strong>
              Gender:
            </strong>
            {" "}
            {student.gender}
          </Typography>

          <Typography
            variant="body2"
          >
            <strong>
              Guardian:
            </strong>
            {" "}
            {student.guardianName ??
              "-"}
          </Typography>

          <Typography
            variant="body2"
          >
            <strong>
              Phone:
            </strong>
            {" "}
            {student.phone ??
              "-"}
          </Typography>

          <Typography
            variant="body2"
          >
            <strong>
              Class:
            </strong>
            {" "}
            {student.class.name}
            {" - "}
            {student.class.section}
          </Typography>

          <Typography
            variant="body2"
          >
            <strong>
              Tenant:
            </strong>
            {" "}
            {student.tenant.name}
          </Typography>
        </Stack>

        <Box>
          <StatusChip
            active={
              student.isActive
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
            href={`/dashboard/students/${student.id}/edit`}
          >
            <Button
              variant="outlined"
            >
              Edit
            </Button>
          </Link>

          <Button
            variant="contained"
            color={
              student.isActive
                ? "error"
                : "success"
            }
            onClick={
              handleToggle
            }
          >
            {student.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Box>
      </Stack>
    </DataCard>
  );
}