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