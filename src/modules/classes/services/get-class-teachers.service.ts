import { prisma } from "@/lib/prisma/client";
import { Role } from "@prisma/client";

export async function getClassTeachers(
  tenantId?: string
) {
  return prisma.user.findMany({
    where: {
      role: Role.TEACHER,
      isActive: true,

      ...(tenantId
        ? { tenantId }
        : {}),
    },

    orderBy: {
      name: "asc",
    },
  });
}