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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("Staff member not found.");
  }

  const isStaff =
    user.role === Role.STAFF ||
    user.role === Role.TEACHER;

  if (!isStaff) {
    throw new Error(
      "Only staff members can be managed through this endpoint.",
    );
  }

  if (user.tenantId !== tenantId) {
    throw new Error(
      "Staff member belongs to another tenant.",
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