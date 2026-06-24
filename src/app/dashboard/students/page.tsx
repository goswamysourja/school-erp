import Link from "next/link";

import {
  Button,
  Stack,
} from "@mui/material";

import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getStudents }
  from "@/modules/students/services/get-students.service";

import { StudentCard }
  from "@/components/students/student-card";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function StudentsPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const students =
    await getStudents();

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage student records"
      />

      <Link
        href="/dashboard/students/create"
      >
        <Button
          variant="contained"
          sx={{
            mb: 3,
          }}
        >
          Create Student
        </Button>
      </Link>

      <Stack spacing={2}>
        {students.map(
          (student) => (
            <StudentCard
              key={student.id}
              student={student}
            />
          )
        )}
      </Stack>
    </>
  );
}