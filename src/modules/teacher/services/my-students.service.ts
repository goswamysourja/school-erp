import { prisma } from "@/lib/prisma/client";

export async function getMyStudents(
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
            sectionId: true,
          },
        },

        classTeacherAssignments: {
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

  const assignedSectionIds = [
    ...new Set([
      ...teacher.teachingAssignments.map(
        (assignment) =>
          assignment.sectionId,
      ),

      ...teacher.classTeacherAssignments.map(
        (assignment) =>
          assignment.sectionId,
      ),
    ]),
  ];

  return prisma.student.findMany({
    where: {
      sectionId: {
        in: assignedSectionIds,
      },
    },

    include: {
      section: {
        include: {
          class: true,
        },
      },
    },

    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });
}