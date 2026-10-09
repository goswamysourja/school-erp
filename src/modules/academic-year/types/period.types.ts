import { AcademicPeriodType } from "@prisma/client";

export interface AcademicPeriodResponse {
  id: string;
  name: string;
  type: AcademicPeriodType;
  startDate: Date;
  endDate: Date;
  marksUploadOpen: boolean;
  marksLockedAt: Date | null;
  academicYearId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}