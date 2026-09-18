import { prisma } from "@/lib/prisma/client";

interface UpdateSectionInput {
  id: string;

  name: string;

  tenantId: string;
}

export async function updateSection(
  input: UpdateSectionInput
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

  const section =
    await prisma.section.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!section) {
    throw new Error(
      "Section not found"
    );
  }

  if (
    section.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Section belongs to another tenant"
    );
  }

  const classItem =
    await prisma.class.findUnique({
      where: {
        id: section.classId,
      },
    });

  if (!classItem) {
    throw new Error(
      "Class not found"
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

  if (!classItem.isActive) {
    throw new Error(
      "Class is inactive"
    );
  }

  const duplicateSection =
    await prisma.section.findFirst({
      where: {
        classId:
          section.classId,

        name:
          input.name,

        NOT: {
          id: input.id,
        },
      },
    });

  if (duplicateSection) {
    throw new Error(
      "Section already exists"
    );
  }

  return prisma.section.update({
    where: {
      id: section.id,
    },

    data: {
      name:
        input.name,
    },

    include: {
      class: true,
    },
  });
}