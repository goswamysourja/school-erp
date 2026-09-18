import Link from "next/link";

import {
  Box,
  Button,
} from "@mui/material";

import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { listTeachingAssignments }
  from "@/modules/teaching-assignment/services";

import { TeachingAssignmentList }
  from "@/components/teaching-assignment/list";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function TeachingAssignmentPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const assignments =
    await listTeachingAssignments(
      currentUser.tenantId,
    );

  return (
    <>
      <PageHeader
        title="Teaching Assignments"
        subtitle="Manage teacher, subject, and section assignments."
      />

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/dashboard/teaching-assignment/create"
          style={{
            textDecoration: "none",
          }}
        >
          <Button variant="contained">
            Create Assignment
          </Button>
        </Link>
      </Box>

      <TeachingAssignmentList
        assignments={assignments}
      />
    </>
  );
}