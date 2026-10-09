import { prisma } from "@/lib/prisma/client";

interface CreateClassInput {
  name: string;
  academicYear: string;
  academicYearId: string;
  tenantId: string;
}

export async function createClass(
  input: CreateClassInput
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

  const existingClass =
    await prisma.class.findFirst({
      where: {
        tenantId:
          input.tenantId,

        name:
          input.name,

        academicYear:
          academicYear.name,
      },
    });

  if (existingClass) {
    throw new Error(
      "Class already exists"
    );
  }

  return prisma.class.create({
    data: {
      name:
        input.name,

      academicYear:
        academicYear.name,

      academicYearId:
        academicYear.id,

      tenantId:
        input.tenantId,
    },
  });
}