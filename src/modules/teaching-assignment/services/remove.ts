import { prisma } from "@/lib/prisma/client";

import { requireExists } from "../guards";

export async function removeTeachingAssignment(
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

  return prisma.teachingAssignment.delete({
    where: {
      id: assignment.id,
    },
  });
}