import type { AcademicYear } from "@prisma/client";

import type { AcademicYearResponse } from "../types/types";

export function mapAcademicYear(
  academicYear: AcademicYear
): AcademicYearResponse {
  return {
    id: academicYear.id,
    name: academicYear.name,
    startDate: academicYear.startDate,
    endDate: academicYear.endDate,
    isActive: academicYear.isActive,
    tenantId: academicYear.tenantId,
    createdAt: academicYear.createdAt,
    updatedAt: academicYear.updatedAt,
  };
}