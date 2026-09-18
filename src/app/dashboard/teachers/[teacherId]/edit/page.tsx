import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getTeacherById } from "@/modules/teacher/services/get-by-id.service";

import { EditTeacherPage } from "@/modules/teacher/pages/edit-teacher-page";

interface Props {
  params: Promise<{
    teacherId: string;
  }>;
}

export default async function EditTeacherRoute({
  params,
}: Props) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Authenticated user is not assigned to a tenant.",
    );
  }

  const { teacherId } =
    await params;

  const teacher =
    await getTeacherById(
      teacherId,
      currentUser.tenantId,
    );

  return (
    <EditTeacherPage
      teacher={teacher}
    />
  );
}