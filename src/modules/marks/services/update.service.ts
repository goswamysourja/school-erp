import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import { validateContext } from "../guards/context";

import type {
  UpdateMarkInput,
} from "../validators/validator";

interface UpdateInput
  extends UpdateMarkInput {
  id: string;
  tenantId: string;
}

export async function updateMark(
  input: UpdateInput,
) {
  const existingMark =
    await prisma.mark.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!existingMark) {
    throw new Error(
      "Marks not found.",
    );
  }

  if (
    existingMark.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Marks do not belong to this tenant.",
    );
  }

  await validateContext({
    tenantId:
      input.tenantId,

    studentId:
      input.studentId,

    teachingAssignmentId:
      input.teachingAssignmentId,

    academicPeriodId:
      input.academicPeriodId,
  });

  const duplicateMark =
    await prisma.mark.findFirst({
      where: {
        studentId:
          input.studentId,

        teachingAssignmentId:
          input.teachingAssignmentId,

        academicPeriodId:
          input.academicPeriodId,

        NOT: {
          id: input.id,
        },
      },
    });

  if (duplicateMark) {
    throw new Error(
      "Marks already exist for this student, subject, and academic period.",
    );
  }

  return prisma.mark.update({
    where: {
      id: existingMark.id,
    },

    data: {
      studentId:
        input.studentId,

      teachingAssignmentId:
        input.teachingAssignmentId,

      academicPeriodId:
        input.academicPeriodId,

      marks:
        new Prisma.Decimal(
          input.marks,
        ),

      maxMarks:
        new Prisma.Decimal(
          input.maxMarks,
        ),
    },

    include: {
      student: true,

      teachingAssignment: {
        include: {
          teacher: true,

          section: {
            include: {
              class: true,
            },
          },

          subject: true,
        },
      },

      academicPeriod: {
        include: {
          academicYear: true,
        },
      },
    },
  });
}