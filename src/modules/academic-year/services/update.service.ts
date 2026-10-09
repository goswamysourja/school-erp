import { prisma } from "@/lib/prisma/client";

interface UpdateAcademicYearInput {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tenantId: string;
}

export async function updateAcademicYear({
  id,
  name,
  startDate,
  endDate,
  tenantId,
}: UpdateAcademicYearInput) {
  if (startDate >= endDate) {
    throw new Error("Academic year start date must be before end date.");
  }

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

  const existingAcademicYear = await prisma.academicYear.findFirst({
    where: {
      tenantId,
      name,
      NOT: {
        id,
      },
    },
  });

  if (existingAcademicYear) {
    throw new Error("An academic year with this name already exists.");
  }

  return prisma.academicYear.update({
    where: {
      id,
    },
    data: {
      name,
      startDate,
      endDate,
    },
  });
}