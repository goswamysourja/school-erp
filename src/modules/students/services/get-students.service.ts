import { prisma } from "@/lib/prisma/client";

export async function getStudents(
  tenantId: string,
) {
  return prisma.student.findMany({
    where: {
      tenantId,
    },

    include: {
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