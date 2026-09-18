import { Role } from "@prisma/client";

import {
  requireRole,
} from "@/modules/auth/guards/require-role.guard";

import {
  listTeachers,
} from "@/modules/teacher/services/list.service";

import {
  TeacherListPage,
} from "@/modules/teacher/pages/teacher-list-page";

export default async function TeachersPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const teachers =
    await listTeachers(
      currentUser.tenantId,
    );

  return (
    <TeacherListPage
      teachers={teachers}
    />
  );
}