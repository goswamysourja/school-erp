import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface ToggleUserStatusInput {
  id: string;
  tenantId: string;
}

export async function toggleUserStatus({
  id,
  tenantId,
}: ToggleUserStatusInput) {
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!user) {
    throw new Error(
      "User not found.",
    );
  }

  if (user.role !== Role.TEACHER) {
    throw new Error(
      "Only teacher users can be managed through this endpoint.",
    );
  }

  if (user.tenantId !== tenantId) {
    throw new Error(
      "User belongs to another tenant.",
    );
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: !user.isActive,
    },
  });
}