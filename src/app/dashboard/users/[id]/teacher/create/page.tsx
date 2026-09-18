import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getUserById } from "@/modules/users/services/get-user-by-id.service";

import { CreateTeacherPage } from "@/modules/teacher/pages/create-teacher-page";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreateTeacherForUserPage({
  params,
}: Props) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const { id } =
    await params;

  const user =
    await getUserById({
      id,
      tenantId:
        currentUser.tenantId,
    });

  if (!user) {
    throw new Error(
      "Teacher user not found.",
    );
  }

  return (
    <CreateTeacherPage
      userId={user.id}
      userName={user.name}
      userPhone={user.phone}
    />
  );
}