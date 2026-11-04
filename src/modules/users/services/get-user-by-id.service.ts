import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface GetUserByIdInput {
  id: string;
  tenantId: string;
}

export async function getUserById({
  id,
  tenantId,
}: GetUserByIdInput) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return null;
  }

  const isStaff =
    user.role === Role.STAFF ||
    user.role === Role.TEACHER;

  if (!isStaff) {
    return null;
  }

  if (user.tenantId !== tenantId) {
    return null;
  }

  return user;
}