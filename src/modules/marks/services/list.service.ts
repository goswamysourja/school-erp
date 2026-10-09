import { prisma } from "@/lib/prisma/client";

interface ListMarksInput {
  tenantId: string;
  teacherId?: string;
  classTeacherSectionIds?: string[];
  studentId?: string;
  teachingAssignmentId?: string;
  academicPeriodId?: string;
}

export async function listMarks({
  tenantId,
  teacherId,
  classTeacherSectionIds = [],
  studentId,
  teachingAssignmentId,
  academicPeriodId,
}: ListMarksInput) {
  const hasTeacherReadScope =
    Boolean(teacherId) || classTeacherSectionIds.length > 0;

  return prisma.mark.findMany({
    where: {
      tenantId,

      ...(studentId && {
        studentId,
      }),

      ...(teachingAssignmentId && {
        teachingAssignmentId,
      }),

      ...(academicPeriodId && {
        academicPeriodId,
      }),

      ...(hasTeacherReadScope
        ? {
            teachingAssignment: {
              OR: [
                ...(teacherId
                  ? [
                      {
                        teacherId,
                      },
                    ]
                  : []),

                ...(classTeacherSectionIds.length
                  ? [
                      {
                        sectionId: {
                          in: classTeacherSectionIds,
                        },
                      },
                    ]
                  : []),
              ],
            },
          }
        : {}),
    },

    include: {
      student: {
        include: {
          section: {
            include: {
              class: true,
            },
          },
        },
      },

      teachingAssignment: {
        include: {
          teacher: true,
          section: {
            include: {
              class: true,
            },
          },
          subject: true,
        },
      },

      academicPeriod: {
        include: {
          academicYear: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}