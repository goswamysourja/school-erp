import { prisma } from "@/lib/prisma/client";

interface DeleteAcademicYearInput {
  id: string;
  tenantId: string;
}

export async function deleteAcademicYear({
  id,
  tenantId,
}: DeleteAcademicYearInput) {
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

  const [classCount, periodCount] = await Promise.all([
    prisma.class.count({
      where: {
        academicYearId: id,
      },
    }),
    prisma.academicPeriod.count({
      where: {
        academicYearId: id,
      },
    }),
  ]);

  if (classCount > 0 || periodCount > 0) {
    throw new Error(
      "Academic year cannot be deleted because it is already in use."
    );
  }

  return prisma.academicYear.delete({
    where: {
      id,
    },
  });
}