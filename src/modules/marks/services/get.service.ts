import { prisma } from "@/lib/prisma/client";

interface GetMarkInput {
  id: string;
  tenantId: string;
  teacherId?: string;
  classTeacherSectionIds?: string[];
}

export async function getMark({
  id,
  tenantId,
  teacherId,
  classTeacherSectionIds = [],
}: GetMarkInput) {
  const hasTeacherReadScope =
    Boolean(teacherId) || classTeacherSectionIds.length > 0;

  const mark = await prisma.mark.findFirst({
    where: {
      id,
      tenantId,

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
  });

  return mark;
}