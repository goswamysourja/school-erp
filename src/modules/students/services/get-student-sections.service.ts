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

      class: {
        tenantId,

        isActive: true,

        academicYearId: {
          not: null,
        },
      },
    },

    include: {
      class: {
        include: {
          academicYearRecord: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}