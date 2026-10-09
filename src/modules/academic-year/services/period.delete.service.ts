import { prisma } from "@/lib/prisma/client";

interface DeleteAcademicPeriodInput {
  id: string;
  academicYearId: string;
  tenantId: string;
}

export async function deleteAcademicPeriod({
  id,
  academicYearId,
  tenantId,
}: DeleteAcademicPeriodInput) {
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

  const academicPeriod = await prisma.academicPeriod.findFirst({
    where: {
      id,
      academicYearId,
      tenantId,
    },
  });

  if (!academicPeriod) {
    throw new Error("Academic period not found.");
  }

  return prisma.academicPeriod.delete({
    where: {
      id,
    },
  });
}