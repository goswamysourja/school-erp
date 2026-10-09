import { prisma } from "@/lib/prisma/client";

export async function getStudents(
  tenantId: string,
  teacherId?: string,
) {
  return prisma.student.findMany({
    where: {
      tenantId,

      ...(teacherId && {
        section: {
          is: {
            teachingAssignments: {
              some: {
                teacherId,
                tenantId,
              },
            },
          },
        },
      }),
    },

    include: {
      section: {
        include: {
          class: {
            include: {
              academicYearRecord: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}