import { prisma } from "@/lib/prisma/client";

import {
  requireExists,
  validateContext,
} from "../guards";

import type {
  UpdateTeachingAssignmentInput,
} from "../validators/update";

interface UpdateInput
  extends UpdateTeachingAssignmentInput {
  id: string;
  tenantId: string;
}

export async function updateTeachingAssignment(
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
      "Teaching assignment does not belong to this tenant.",
    );
  }

  await validateContext({
    tenantId:
      input.tenantId,

    teacherId:
      input.teacherId,

    sectionId:
      input.sectionId,

    subjectId:
      input.subjectId,
  });

  const existingAssignment =
    await prisma.teachingAssignment.findFirst({
      where: {
        sectionId:
          input.sectionId,

        subjectId:
          input.subjectId,

        NOT: {
          id: input.id,
        },
      },
    });

  if (existingAssignment) {
    throw new Error(
      "Teaching assignment already exists for this section and subject.",
    );
  }

  return prisma.teachingAssignment.update({
    where: {
      id: input.id,
    },

    data: {
      teacherId:
        input.teacherId,

      sectionId:
        input.sectionId,

      subjectId:
        input.subjectId,
    },

    include: {
      teacher: true,

      section: {
        include: {
          class: true,
        },
      },

      subject: true,
    },
  });
}