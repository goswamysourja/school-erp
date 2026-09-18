import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getMyStudents } from "@/modules/teacher/services";

import { MyStudentsPage } from "@/modules/teacher/pages/my-students-page";

export default async function MyStudentsRoute() {
  const currentUser =
    await requireRole([
      Role.TEACHER,
    ]);

  const students =
    await getMyStudents(
      currentUser.id,
    );

  return (
    <MyStudentsPage
      students={students}
    />
  );
}