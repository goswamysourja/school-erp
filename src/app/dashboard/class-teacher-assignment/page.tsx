import Link from "next/link";

import {
  Box,
  Button,
} from "@mui/material";

import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { listClassTeacherAssignments }
  from "@/modules/class-teacher-assignment/services";

import { ClassTeacherAssignmentList }
  from "@/components/class-teacher-assignment/list";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function ClassTeacherAssignmentPage() {
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
    await listClassTeacherAssignments(
      currentUser.tenantId,
    );

  return (
    <>
      <PageHeader
        title="Class Teachers"
        subtitle="Manage class teacher assignments for your school."
      />

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/dashboard/class-teacher-assignment/create"
          style={{
            textDecoration: "none",
          }}
        >
          <Button variant="contained">
            Assign Class Teacher
          </Button>
        </Link>
      </Box>

      <ClassTeacherAssignmentList
        assignments={assignments}
      />
    </>
  );
}