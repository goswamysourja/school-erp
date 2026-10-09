import { prisma } from "@/lib/prisma/client";

interface CreateSectionInput {
  name: string;

  classId: string;

  tenantId: string;
}

export async function createSection(
  input: CreateSectionInput
) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: input.tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error(
      "Tenant is inactive"
    );
  }

  const classItem =
    await prisma.class.findUnique({
      where: {
        id: input.classId,
      },
    });

  if (!classItem) {
    throw new Error(
      "Class not found"
    );
  }

  if (!classItem.isActive) {
    throw new Error(
      "Class is inactive"
    );
  }

  if (
    classItem.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Class belongs to another tenant"
    );
  }

  if (!classItem.academicYearId) {
    throw new Error(
      "Class is not linked to an academic year"
    );
  }

  const existingSection =
    await prisma.section.findFirst({
      where: {
        classId:
          input.classId,

        name:
          input.name,
      },
    });

  if (existingSection) {
    throw new Error(
      "Section already exists"
    );
  }

  return prisma.section.create({
    data: {
      name:
        input.name,

      tenantId:
        input.tenantId,

      classId:
        input.classId,
    },
  });
}