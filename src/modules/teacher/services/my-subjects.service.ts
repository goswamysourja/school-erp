import { prisma } from "@/lib/prisma/client";

export async function getMySubjects(
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
            subject: true,

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

  return teacher.teachingAssignments
    .map((assignment) => ({
      subject: assignment.subject,
      section: assignment.section,
    }))
    .sort((a, b) => {
      const subjectComparison =
        a.subject.name.localeCompare(
          b.subject.name,
        );

      if (subjectComparison !== 0) {
        return subjectComparison;
      }

      const classComparison =
        a.section.class.name.localeCompare(
          b.section.class.name,
        );

      if (classComparison !== 0) {
        return classComparison;
      }

      return a.section.name.localeCompare(
        b.section.name,
      );
    });
}