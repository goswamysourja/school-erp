import { prisma } from "@/lib/prisma/client";

interface GetSectionsInput {
  tenantId: string;
  classId?: string;
}

export async function getSections({
  tenantId,
  classId,
}: GetSectionsInput) {
  return prisma.section.findMany({
    where: {
      tenantId,
      ...(classId && {
        classId,
      }),
    },

    include: {
      class: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}