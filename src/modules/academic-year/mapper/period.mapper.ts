import type { AcademicPeriod } from "@prisma/client";

import type { AcademicPeriodResponse } from "../types/period.types";

export function mapAcademicPeriod(
  period: AcademicPeriod
): AcademicPeriodResponse {
  return {
    id: period.id,
    name: period.name,
    type: period.type,
    startDate: period.startDate,
    endDate: period.endDate,
    marksUploadOpen: period.marksUploadOpen,
    marksLockedAt: period.marksLockedAt,
    academicYearId: period.academicYearId,
    tenantId: period.tenantId,
    createdAt: period.createdAt,
    updatedAt: period.updatedAt,
  };
}