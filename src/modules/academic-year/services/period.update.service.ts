import { AcademicPeriodType } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface UpdateAcademicPeriodInput {
  id: string;
  name: string;
  type: AcademicPeriodType;
  startDate: Date;
  endDate: Date;
  academicYearId: string;
  tenantId: string;
}

export async function updateAcademicPeriod({
  id,
  name,
  type,
  startDate,
  endDate,
  academicYearId,
  tenantId,
}: UpdateAcademicPeriodInput) {
  if (startDate >= endDate) {
    throw new Error("Period start date must be before the end date.");
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
      id: academicYearId,
      tenantId,
    },
  });

  if (!academicYear) {
    throw new Error("Academic year not found.");
  }

  if (
    startDate < academicYear.startDate ||
    endDate > academicYear.endDate
  ) {
    throw new Error(
      "Academic period dates must fall within the academic year."
    );
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

  const existingPeriod = await prisma.academicPeriod.findFirst({
    where: {
      academicYearId,
      name,
      NOT: {
        id,
      },
    },
  });

  if (existingPeriod) {
    throw new Error(
      "An academic period with this name already exists in this academic year."
    );
  }

  return prisma.academicPeriod.update({
    where: {
      id,
    },
    data: {
      name,
      type,
      startDate,
      endDate,
    },
  });
}