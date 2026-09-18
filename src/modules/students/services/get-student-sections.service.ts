import { prisma } from "@/lib/prisma/client";

interface GetStudentSectionsInput {
  tenantId: string;
}

export async function getStudentSections({
  tenantId,
}: GetStudentSectionsInput) {
  return prisma.section.findMany({
    where: {
      tenantId,

      isActive: true,
    },

    include: {
      class: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}