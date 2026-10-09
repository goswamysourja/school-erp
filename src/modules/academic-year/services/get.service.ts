import { prisma } from "@/lib/prisma/client";

import { mapAcademicYear } from "../mapper/mapper";
import type { AcademicYearResponse } from "../types/types";

interface GetAcademicYearsInput {
  tenantId: string;
}

interface GetAcademicYearInput {
  id: string;
  tenantId: string;
}

export async function getAcademicYears({
  tenantId,
}: GetAcademicYearsInput): Promise<AcademicYearResponse[]> {
  const academicYears = await prisma.academicYear.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return academicYears.map(mapAcademicYear);
}

export async function getAcademicYear({
  id,
  tenantId,
}: GetAcademicYearInput): Promise<AcademicYearResponse | null> {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id,
      tenantId,
    },
  });

  if (!academicYear) {
    return null;
  }

  return mapAcademicYear(academicYear);
}