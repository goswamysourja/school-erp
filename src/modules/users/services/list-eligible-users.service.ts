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
      isActive: true,

      role: {
        in: [
          Role.STAFF,
          Role.TEACHER, // Temporary legacy support
        ],
      },

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
      designation: true,
    },
  });
}