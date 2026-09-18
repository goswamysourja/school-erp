import { prisma } from "@/lib/prisma/client";

export async function listTeachingAssignments(
  tenantId: string,
) {
  return prisma.teachingAssignment.findMany({
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

      subject: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}