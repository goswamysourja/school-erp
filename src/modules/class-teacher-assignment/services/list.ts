import { prisma } from "@/lib/prisma/client";

export async function listClassTeacherAssignments(
  tenantId: string,
) {
  return prisma.classTeacherAssignment.findMany({
    where: {
      tenantId,
    },

    include: {
      teacher: true,

      section: {
        include: {
          class: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}