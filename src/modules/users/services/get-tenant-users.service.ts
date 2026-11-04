import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface GetTenantUsersInput {
  tenantId: string;
}

export async function getTenantUsers({
  tenantId,
}: GetTenantUsersInput) {
  const users = await prisma.user.findMany({
    where: {
      tenantId,
      role: {
        in: [
          Role.STAFF,
          Role.TEACHER, // Temporary support for legacy accounts
        ],
      },
    },

    include: {
      tenant: true,
      teacher: {
        select: {
          id: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    ...user,
    hasTeacherProfile: user.teacher !== null,
  }));
}