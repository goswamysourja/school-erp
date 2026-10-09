import { prisma } from "@/lib/prisma/client";

interface ToggleAcademicYearInput {
  id: string;
  tenantId: string;
}

export async function toggleAcademicYear({
  id,
  tenantId,
}: ToggleAcademicYearInput) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id,
      tenantId,
    },
  });

  if (!academicYear) {
    throw new Error("Academic year not found.");
  }

  return prisma.academicYear.update({
    where: {
      id,
    },
    data: {
      isActive: !academicYear.isActive,
    },
  });
}