import { prisma } from "@/lib/prisma/client";

export async function listTeachingAssignments(
  tenantId: string,
  teacherId?: string,
) {
  return prisma.teachingAssignment.findMany({
    where: {
      tenantId,

      ...(teacherId && {
        teacherId,
      }),
    },

    include: {
      teacher: true,

      section: {
        include: {
          class: {
            include: {
              academicYearRecord: true,
            },
          },
        },
      },

      subject: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}