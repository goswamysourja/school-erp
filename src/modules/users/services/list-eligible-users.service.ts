import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface ListEligibleTeacherUsersInput {
  tenantId: string;
}

export async function listEligibleTeacherUsers({
  tenantId,
}: ListEligibleTeacherUsersInput) {
  return prisma.user.findMany({
    where: {
      tenantId,

      role: Role.TEACHER,

      isActive: true,

      teacher: {
        is: null,
      },
    },

    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      phone: true,
    },
  });
}