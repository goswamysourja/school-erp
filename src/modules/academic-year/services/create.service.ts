import { prisma } from "@/lib/prisma/client";

interface CreateAcademicYearInput {
  name: string;
  startDate: Date;
  endDate: Date;
  tenantId: string;
}

export async function createAcademicYear({
  name,
  startDate,
  endDate,
  tenantId,
}: CreateAcademicYearInput) {
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

  const existingAcademicYear = await prisma.academicYear.findUnique({
    where: {
      tenantId_name: {
        tenantId,
        name,
      },
    },
  });

  if (existingAcademicYear) {
    throw new Error("An academic year with this name already exists.");
  }

  return prisma.academicYear.create({
    data: {
      name,
      startDate,
      endDate,
      tenantId,
      isActive: true,
    },
  });
}