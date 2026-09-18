import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getMySubjects } from "@/modules/teacher/services";

import { MySubjectsPage } from "@/modules/teacher/pages/my-subjects-page";

export default async function MySubjectsRoute() {
  const currentUser =
    await requireRole([
      Role.TEACHER,
    ]);

  const subjects =
    await getMySubjects(
      currentUser.id,
    );

  return (
    <MySubjectsPage
      subjects={subjects}
    />
  );
}