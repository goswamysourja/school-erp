import { prisma } from "@/lib/prisma/client";

export async function getMyClasses(
  userId: string,
) {
  const teacher =
    await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        teachingAssignments: {
          select: {
            section: {
              include: {
                class: true,
              },
            },
          },
        },

        classTeacherAssignments: {
          select: {
            section: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

  if (!teacher) {
    throw new Error(
      "Teacher profile not found.",
    );
  }

  const sections = [
    ...teacher.teachingAssignments.map(
      (assignment) =>
        assignment.section,
    ),

    ...teacher.classTeacherAssignments.map(
      (assignment) =>
        assignment.section,
    ),
  ];

  const uniqueSections = Array.from(
    new Map(
      sections.map((section) => [
        section.id,
        section,
      ]),
    ).values(),
  );

  return uniqueSections.sort(
    (a, b) => {
      const classComparison =
        a.class.name.localeCompare(
          b.class.name,
        );

      if (classComparison !== 0) {
        return classComparison;
      }

      return a.name.localeCompare(
        b.name,
      );
    },
  );
}

export async function getMyClassSection(
  userId: string,
  sectionId: string,
) {
  const teacher =
    await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,

        teachingAssignments: {
          where: {
            sectionId,
          },
          select: {
            section: {
              include: {
                class: true,
              },
            },
          },
        },

        classTeacherAssignments: {
          where: {
            sectionId,
          },
          select: {
            section: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

  if (!teacher) {
    throw new Error(
      "Teacher profile not found.",
    );
  }

  const section =
    teacher.teachingAssignments[0]
      ?.section ??
    teacher.classTeacherAssignments[0]
      ?.section;

  if (!section) {
    throw new Error(
      "You are not assigned to this section.",
    );
  }

  return section;
}

export async function getMyClassDetails(
  userId: string,
  sectionId: string,
) {
  const teacher =
    await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,

        teachingAssignments: {
          where: {
            sectionId,
          },
          select: {
            sectionId: true,
          },
        },

        classTeacherAssignments: {
          where: {
            sectionId,
          },
          select: {
            sectionId: true,
          },
        },
      },
    });

  if (!teacher) {
    throw new Error(
      "Teacher profile not found.",
    );
  }

  const hasAccess =
    teacher.teachingAssignments.length >
      0 ||
    teacher.classTeacherAssignments
      .length > 0;

  if (!hasAccess) {
    throw new Error(
      "You are not assigned to this section.",
    );
  }

  const section =
    await prisma.section.findUnique({
      where: {
        id: sectionId,
      },

      select: {
        id: true,
        name: true,

        class: {
          select: {
            id: true,
            name: true,
            academicYear: true,
          },
        },

        teachingAssignments: {
          select: {
            teacherId: true,

            teacher: {
              select: {
                firstName: true,
                lastName: true,
              },
            },

            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
                isActive: true,
              },
            },
          },

          orderBy: {
            subject: {
              name: "asc",
            },
          },
        },

        classTeacherAssignments: {
          where: {
            teacherId: teacher.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

  if (!section) {
    throw new Error(
      "Section not found.",
    );
  }

  return {
    id: section.id,
    name: section.name,
    class: section.class,

    isClassTeacher:
      section.classTeacherAssignments.length >
      0,

    subjects:
      section.teachingAssignments.map(
        (assignment) => ({
          id: assignment.subject.id,
          name: assignment.subject.name,
          code: assignment.subject.code,
          description:
            assignment.subject
              .description,
          isActive:
            assignment.subject
              .isActive,

          teacherId:
            assignment.teacherId,

          teacherName:
            `${assignment.teacher.firstName} ${assignment.teacher.lastName}`,

          isMine:
            assignment.teacherId ===
            teacher.id,
        }),
      ),
  };
}