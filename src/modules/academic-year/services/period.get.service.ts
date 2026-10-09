import { prisma } from "@/lib/prisma/client";

import { mapAcademicPeriod } from "../mapper/period.mapper";

import type { AcademicPeriodResponse } from "../types/period.types";

interface GetAcademicPeriodsInput {
  academicYearId: string;
  tenantId: string;
  teacherId?: string;
}

interface GetAcademicPeriodInput {
  id: string;
  academicYearId: string;
  tenantId: string;
}

export async function getAcademicPeriods({
  academicYearId,
  tenantId,
  teacherId,
}: GetAcademicPeriodsInput): Promise<AcademicPeriodResponse[]> {
  const academicYear =
    await prisma.academicYear.findFirst({
      where: {
        id: academicYearId,
        tenantId,
      },
    });

  if (!academicYear) {
    throw new Error(
      "Academic year not found.",
    );
  }

  const periods =
    await prisma.academicPeriod.findMany({
      where: {
        academicYearId,
        tenantId,

        ...(teacherId && {
          academicYear: {
            classes: {
              some: {
                sections: {
                  some: {
                    teachingAssignments: {
                      some: {
                        teacherId,
                        tenantId,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      },

      orderBy: {
        startDate: "asc",
      },
    });

  return periods.map(
    mapAcademicPeriod,
  );
}

export async function getAcademicPeriod({
  id,
  academicYearId,
  tenantId,
}: GetAcademicPeriodInput): Promise<AcademicPeriodResponse | null> {
  const period =
    await prisma.academicPeriod.findFirst({
      where: {
        id,
        academicYearId,
        tenantId,
      },
    });

  if (!period) {
    return null;
  }

  return mapAcademicPeriod(period);
}