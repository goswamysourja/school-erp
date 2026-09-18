import { prisma } from "@/lib/prisma/client";

import { validateContext } from "../guards";

import type {
  CreateClassTeacherAssignmentInput,
} from "../validators/create";

interface CreateInput
  extends CreateClassTeacherAssignmentInput {
  tenantId: string;
}

export async function createClassTeacherAssignment(
  input: CreateInput,
) {
  await validateContext({
    tenantId:
      input.tenantId,

    teacherId:
      input.teacherId,

    sectionId:
      input.sectionId,
  });

  const existingAssignment =
    await prisma.classTeacherAssignment.findUnique({
      where: {
        sectionId:
          input.sectionId,
      },
    });

  if (existingAssignment) {
    throw new Error(
      "Class teacher is already assigned to this section.",
    );
  }

  return prisma.classTeacherAssignment.create({
    data: {
      tenantId:
        input.tenantId,

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