import Link from "next/link";

import {
  Box,
  Button,
  Stack,
} from "@mui/material";

import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getStudents } from "@/modules/students/services/get-students.service";

import { StudentCard } from "@/components/students/student-card";

import { PageHeader } from "@/components/ui/page-header";

export default async function StudentsPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const students =
    await getStudents(
      currentUser.tenantId,
    );

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage students for your school."
      />

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/dashboard/students/create"
          style={{
            textDecoration: "none",
          }}
        >
          <Button variant="contained">
            Create Student
          </Button>
        </Link>
      </Box>

      <Stack spacing={3}>
        {students.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
            }}
          >
            No students found.
          </Box>
        ) : (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
            />
          ))
        )}
      </Stack>
    </>
  );
}