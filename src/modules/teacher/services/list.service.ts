import { prisma } from "@/lib/prisma/client";

import { mapTeacherResponse } from "../mapper";

export async function listTeachers(
  tenantId?: string | null,
) {
  const teachers =
    await prisma.teacher.findMany({
      where: {
        isActive: true,

        ...(tenantId
          ? {
              tenantId,
            }
          : {}),
      },

      include: {
        tenant: true,
        user: true,
      },

      orderBy: {
        firstName: "asc",
      },
    });

  return teachers.map(
    mapTeacherResponse,
  );
}