import { prisma } from "@/lib/prisma/client";

interface UpdateClassInput {
  id: string;

  name: string;

  academicYear: string;

  academicYearId: string;

  tenantId: string;
}

export async function updateClass(
  input: UpdateClassInput
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

  const existingClass =
    await prisma.class.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!existingClass) {
    throw new Error(
      "Class not found"
    );
  }

  if (
    existingClass.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Class belongs to another tenant"
    );
  }

  const academicYear =
    await prisma.academicYear.findFirst({
      where: {
        id: input.academicYearId,
        tenantId: input.tenantId,
      },
    });

  if (!academicYear) {
    throw new Error(
      "Academic year not found"
    );
  }

  const duplicateClass =
    await prisma.class.findFirst({
      where: {
        tenantId:
          input.tenantId,

        name:
          input.name,

        academicYear:
          academicYear.name,

        NOT: {
          id: input.id,
        },
      },
    });

  if (duplicateClass) {
    throw new Error(
      "Class already exists"
    );
  }

  return prisma.class.update({
    where: {
      id: existingClass.id,
    },

    data: {
      name:
        input.name,

      academicYear:
        academicYear.name,

      academicYearId:
        academicYear.id,
    },

    include: {
      sections: true,
    },
  });
}