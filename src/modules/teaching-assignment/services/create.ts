import { prisma } from "@/lib/prisma/client";

import { validateContext } from "../guards";

import type {
  CreateTeachingAssignmentInput,
} from "../validators/create";

interface CreateInput
  extends CreateTeachingAssignmentInput {
  tenantId: string;
}

export async function createTeachingAssignment(
  input: CreateInput,
) {
  await validateContext({
    tenantId: input.tenantId,
    teacherId: input.teacherId,
    sectionId: input.sectionId,
    subjectId: input.subjectId,
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
    await prisma.teachingAssignment.findUnique({
      where: {
        sectionId_subjectId: {
          sectionId: input.sectionId,
          subjectId: input.subjectId,
        },
      },
    });

  if (existingAssignment) {
    throw new Error(
      "Teaching assignment already exists for this section and subject.",
    );
  }

  return prisma.teachingAssignment.create({
    data: {
      tenantId: input.tenantId,

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