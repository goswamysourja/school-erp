import { prisma } from "@/lib/prisma/client";

import { requireExists } from "../guards";

export async function removeClassTeacherAssignment(
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

  return prisma.classTeacherAssignment.delete({
    where: {
      id: assignment.id,
    },
  });
}