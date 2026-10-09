import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import { validateContext } from "../guards/context";

import type {
  CreateMarkInput,
} from "../validators/validator";

interface CreateInput
  extends CreateMarkInput {
  tenantId: string;
}

export async function createMark(
  input: CreateInput,
) {
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

  const existingMark =
    await prisma.mark.findUnique({
      where: {
        studentId_teachingAssignmentId_academicPeriodId:
          {
            studentId:
              input.studentId,

            teachingAssignmentId:
              input.teachingAssignmentId,

            academicPeriodId:
              input.academicPeriodId,
          },
      },
    });

  if (existingMark) {
    throw new Error(
      "Marks already exist for this student, subject, and academic period.",
    );
  }

  return prisma.mark.create({
    data: {
      tenantId:
        input.tenantId,

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