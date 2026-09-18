import { prisma } from "@/lib/prisma/client";

import {
  requireExists,
  validateContext,
} from "../guards";

import type {
  UpdateClassTeacherAssignmentInput,
} from "../validators/update";

interface UpdateInput
  extends UpdateClassTeacherAssignmentInput {
  id: string;
  tenantId: string;
}

export async function updateClassTeacherAssignment(
  input: UpdateInput,
) {
  const assignment =
    await requireExists(
      input.id,
    );

  if (
    assignment.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Class teacher assignment does not belong to this tenant.",
    );
  }

  await validateContext({
    tenantId:
      input.tenantId,

    teacherId:
      input.teacherId,

    sectionId:
      input.sectionId,
  });

  const existingAssignment =
    await prisma.classTeacherAssignment.findFirst({
      where: {
        sectionId:
          input.sectionId,

        NOT: {
          id: input.id,
        },
      },
    });

  if (existingAssignment) {
    throw new Error(
      "Class teacher is already assigned to this section.",
    );
  }

  return prisma.classTeacherAssignment.update({
    where: {
      id: input.id,
    },

    data: {
      teacherId:
        input.teacherId,

      sectionId:
        input.sectionId,
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
}