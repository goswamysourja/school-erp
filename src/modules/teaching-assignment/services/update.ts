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

  const section =
    await prisma.section.findUnique({
      where: {
        id: input.sectionId,
      },

      include: {
        class: {
          select: {
            id: true,
            tenantId: true,
            isActive: true,
            academicYearId: true,
          },
        },
      },
    });

  if (!section) {
    throw new Error(
      "Section not found.",
    );
  }

  if (
    section.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Section belongs to another tenant.",
    );
  }

  if (!section.class.isActive) {
    throw new Error(
      "Class is inactive.",
    );
  }

  if (
    section.class.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Class belongs to another tenant.",
    );
  }

  if (!section.class.academicYearId) {
    throw new Error(
      "Class is not linked to an academic year.",
    );
  }

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