import { prisma } from "@/lib/prisma/client";

import { requireExists } from "../guards";

export async function getTeachingAssignment(
  assignmentId: string,
  tenantId: string,
) {
  const assignment =
    await requireExists(
      assignmentId,
    );

  if (
    assignment.tenantId !==
    tenantId
  ) {
    throw new Error(
      "Teaching assignment does not belong to this tenant.",
    );
  }

  const assignmentWithRelations =
    await prisma.teachingAssignment.findUnique({
      where: {
        id: assignment.id,
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
    });

  if (!assignmentWithRelations) {
    throw new Error(
      "Teaching assignment not found.",
    );
  }

  return assignmentWithRelations;
}