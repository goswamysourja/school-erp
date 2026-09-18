import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface GetTenantUsersInput {
  tenantId: string;
}

export async function getTenantUsers({
  tenantId,
}: GetTenantUsersInput) {
  const users =
    await prisma.user.findMany({
      where: {
        tenantId,
        role: Role.TEACHER,
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
    hasTeacherProfile:
      user.teacher !== null,
  }));
}