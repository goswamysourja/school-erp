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
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!user) {
    return null;
  }

  if (user.role !== Role.TEACHER) {
    return null;
  }

  if (user.tenantId !== tenantId) {
    return null;
  }

  return user;
}