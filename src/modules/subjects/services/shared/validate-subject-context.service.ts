import { prisma } from "@/lib/prisma/client";

interface ValidateSubjectContextInput {
  tenantId: string;
  classId: string;
}

export async function validateSubjectContext({
  tenantId,
  classId,
}: ValidateSubjectContextInput) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  if (!tenant.isActive) {
    throw new Error(
      "Tenant is inactive"
    );
  }

  const classItem =
    await prisma.class.findUnique({
      where: {
        id: classId,
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
    tenantId
  ) {
    throw new Error(
      "Class belongs to another tenant"
    );
  }

  return {
    tenant,
    classItem,
  };
}