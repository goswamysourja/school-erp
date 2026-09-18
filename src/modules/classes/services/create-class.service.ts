import { prisma } from "@/lib/prisma/client";

interface CreateClassInput {
  name: string;
  academicYear: string;
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

  const existingClass =
    await prisma.class.findFirst({
      where: {
        tenantId:
          input.tenantId,

        name:
          input.name,

        academicYear:
          input.academicYear,
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
        input.academicYear,

      tenantId:
        input.tenantId,
    },
  });
}