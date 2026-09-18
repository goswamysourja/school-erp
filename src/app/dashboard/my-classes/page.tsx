import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getMyClasses } from "@/modules/teacher/services";

import { MyClassesPage } from "@/modules/teacher/pages/my-classes-page";

export default async function MyClassesRoute() {
  const currentUser =
    await requireRole([
      Role.TEACHER,
    ]);

  const sections =
    await getMyClasses(
      currentUser.id,
    );

  return (
    <MyClassesPage
      sections={sections}
    />
  );
}