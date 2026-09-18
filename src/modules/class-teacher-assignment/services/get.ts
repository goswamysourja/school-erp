import { prisma } from "@/lib/prisma/client";

import { requireExists } from "../guards";

export async function getClassTeacherAssignment(
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
      "Class teacher assignment does not belong to this tenant.",
    );
  }

  const assignmentWithRelations =
    await prisma.classTeacherAssignment.findUnique({
      where: {
        id: assignment.id,
      },

      include: {
        teacher: true,

        section: {
          include: {
            class: true,
          },
        },
      },
    });

  if (!assignmentWithRelations) {
    throw new Error(
      "Class teacher assignment not found.",
    );
  }

  return assignmentWithRelations;
}