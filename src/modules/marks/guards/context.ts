import { prisma } from "@/lib/prisma/client";

interface MarkContextInput {
  tenantId: string;
  studentId: string;
  teachingAssignmentId: string;
  academicPeriodId: string;
}

export async function validateContext(
  input: MarkContextInput,
) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: input.tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found.",
    );
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error(
      "Tenant is inactive.",
    );
  }

  const student =
    await prisma.student.findUnique({
      where: {
        id: input.studentId,
      },

      include: {
        section: {
          include: {
            class: true,
          },
        },
      },
    });

  if (!student) {
    throw new Error(
      "Student not found.",
    );
  }

  if (!student.isActive) {
    throw new Error(
      "Student is inactive.",
    );
  }

  if (
    student.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Student belongs to another tenant.",
    );
  }

  if (!student.section) {
    throw new Error(
      "Student is not assigned to a section.",
    );
  }

  const studentSection =
    student.section;

  if (!studentSection.isActive) {
    throw new Error(
      "Student section is inactive.",
    );
  }

  if (
    studentSection.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Student section belongs to another tenant.",
    );
  }

  const studentClass =
    studentSection.class;

  if (!studentClass.isActive) {
    throw new Error(
      "Student class is inactive.",
    );
  }

  if (
    studentClass.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Student class belongs to another tenant.",
    );
  }

  if (!studentClass.academicYearId) {
    throw new Error(
      "Student class is not linked to an academic year.",
    );
  }

  const assignment =
    await prisma.teachingAssignment.findUnique({
      where: {
        id: input.teachingAssignmentId,
      },

      include: {
        teacher: true,

        subject: true,

        section: {
          include: {
            class: true,
          },
        },
      },
    });

  if (!assignment) {
    throw new Error(
      "Teaching assignment not found.",
    );
  }

  if (
    assignment.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Teaching assignment belongs to another tenant.",
    );
  }

  if (!assignment.teacher.isActive) {
    throw new Error(
      "Assigned teacher is inactive.",
    );
  }

  if (
    assignment.teacher.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Assigned teacher belongs to another tenant.",
    );
  }

  if (!assignment.subject.isActive) {
    throw new Error(
      "Assigned subject is inactive.",
    );
  }

  if (
    assignment.subject.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Assigned subject belongs to another tenant.",
    );
  }

  if (!assignment.section.isActive) {
    throw new Error(
      "Teaching assignment section is inactive.",
    );
  }

  if (
    assignment.section.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Teaching assignment section belongs to another tenant.",
    );
  }

  if (!assignment.section.class.isActive) {
    throw new Error(
      "Teaching assignment class is inactive.",
    );
  }

  if (
    assignment.section.class.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Teaching assignment class belongs to another tenant.",
    );
  }

  if (!assignment.section.class.academicYearId) {
    throw new Error(
      "Teaching assignment class is not linked to an academic year.",
    );
  }

  if (
    student.sectionId !==
    assignment.sectionId
  ) {
    throw new Error(
      "Student does not belong to the teaching assignment section.",
    );
  }

  if (
    studentClass.academicYearId !==
    assignment.section.class.academicYearId
  ) {
    throw new Error(
      "Student and teaching assignment belong to different academic years.",
    );
  }

  const academicPeriod =
    await prisma.academicPeriod.findUnique({
      where: {
        id: input.academicPeriodId,
      },

      include: {
        academicYear: true,
      },
    });

  if (!academicPeriod) {
    throw new Error(
      "Academic period not found.",
    );
  }

  if (
    academicPeriod.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Academic period belongs to another tenant.",
    );
  }

  if (!academicPeriod.academicYear.isActive) {
    throw new Error(
      "Academic year is inactive.",
    );
  }

  if (
    academicPeriod.academicYear.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Academic year belongs to another tenant.",
    );
  }

  if (
    academicPeriod.academicYearId !==
    studentClass.academicYearId
  ) {
    throw new Error(
      "Academic period belongs to a different academic year.",
    );
  }

  if (
    academicPeriod.academicYearId !==
    assignment.section.class.academicYearId
  ) {
    throw new Error(
      "Academic period and teaching assignment belong to different academic years.",
    );
  }

  if (!academicPeriod.marksUploadOpen) {
    throw new Error(
      "Marks upload is closed for this academic period.",
    );
  }

  return {
    tenant,
    student,
    assignment,
    academicPeriod,
  };
}