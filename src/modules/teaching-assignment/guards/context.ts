import { prisma } from "@/lib/prisma/client";

interface ContextInput {
  tenantId: string;

  teacherId: string;

  sectionId: string;

  subjectId: string;
}

export async function validateContext(
  input: ContextInput,
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

  const teacher =
    await prisma.teacher.findUnique({
      where: {
        id: input.teacherId,
      },
    });

  if (!teacher) {
    throw new Error(
      "Teacher not found.",
    );
  }

  if (
    !teacher.isActive
  ) {
    throw new Error(
      "Teacher is inactive.",
    );
  }

  if (
    teacher.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Teacher belongs to another tenant.",
    );
  }

  const section =
    await prisma.section.findUnique({
      where: {
        id: input.sectionId,
      },
    });

  if (!section) {
    throw new Error(
      "Section not found.",
    );
  }

  if (
    !section.isActive
  ) {
    throw new Error(
      "Section is inactive.",
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

  const subject =
    await prisma.subject.findUnique({
      where: {
        id: input.subjectId,
      },
    });

  if (!subject) {
    throw new Error(
      "Subject not found.",
    );
  }

  if (
    !subject.isActive
  ) {
    throw new Error(
      "Subject is inactive.",
    );
  }

  if (
    subject.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Subject belongs to another tenant.",
    );
  }

  return {
    tenant,
    teacher,
    section,
    subject,
  };
}